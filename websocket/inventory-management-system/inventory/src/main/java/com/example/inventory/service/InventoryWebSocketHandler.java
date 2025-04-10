package com.example.inventory.service;

import com.example.inventory.model.InventoryItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class InventoryWebSocketHandler extends TextWebSocketHandler {

    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final InventoryService inventoryService;

    @Autowired
    public InventoryWebSocketHandler(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        List<InventoryItem> items = inventoryService.getAllItems();
        String jsonMessage = convertToJson(items);
        session.sendMessage(new TextMessage(jsonMessage));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    public void broadcast(String message) {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
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