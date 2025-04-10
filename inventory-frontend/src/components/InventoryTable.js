import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateItemForm from './UpdateItemForm';

const InventoryTable = () => {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8080/ws');

        websocket.onopen = () => console.log('WebSocket Connected');
        websocket.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
            const updatedItems = JSON.parse(event.data);
            setItems(updatedItems);
        };
        websocket.onerror = (error) => console.error('WebSocket Error:', error);
        websocket.onclose = () => console.log('WebSocket Disconnected');

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/inventory');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/inventory/${id}`);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div>
            <h2>Warehouse Inventory</h2>
            {editingItem && (
                <UpdateItemForm
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onUpdate={fetchItems}
                />
            )}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price ($)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr><td colSpan="5">No items yet</td></tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => setEditingItem(item)}>Edit</button>
                                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;