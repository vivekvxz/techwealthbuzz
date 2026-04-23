package com.example.inventory.service;

import com.example.inventory.model.InventoryItem;
import com.example.inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    @Autowired
    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }

    public InventoryItem addItem(InventoryItem item, InventoryWebSocketHandler webSocketHandler) {
        InventoryItem savedItem = repository.save(item);
        broadcastUpdate(webSocketHandler);
        return savedItem;
    }

    public InventoryItem updateItem(Long id, InventoryItem itemDetails, InventoryWebSocketHandler webSocketHandler) {
        Optional<InventoryItem> optionalItem = repository.findById(id);
        if (optionalItem.isPresent()) {
            InventoryItem item = optionalItem.get();
            item.setName(itemDetails.getName());
            item.setQuantity(itemDetails.getQuantity());
            item.setPrice(itemDetails.getPrice());
            InventoryItem updatedItem = repository.save(item);
            broadcastUpdate(webSocketHandler);
            return updatedItem;
        }
        throw new RuntimeException("Item not found with id " + id);
    }

    public void deleteItem(Long id, InventoryWebSocketHandler webSocketHandler) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            broadcastUpdate(webSocketHandler);
        } else {
            throw new RuntimeException("Item not found with id " + id);
        }
    }

    private void broadcastUpdate(InventoryWebSocketHandler webSocketHandler) {
        List<InventoryItem> items = getAllItems();
        String jsonMessage = convertToJson(items);
        System.out.println("Broadcasting: " + jsonMessage);
        webSocketHandler.broadcast(jsonMessage);
    }

    private String convertToJson(List<InventoryItem> items) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < items.size(); i++) {
            InventoryItem item = items.get(i);
            json.append(String.format("{\"id\":%d,\"name\":\"%s\",\"quantity\":%d,\"price\":%.2f}",
                    item.getId(), item.getName(), item.getQuantity(), item.getPrice()));
            if (i < items.size() - 1) json.append(",");
        }
        json.append("]");
        return json.toString();
    }
}