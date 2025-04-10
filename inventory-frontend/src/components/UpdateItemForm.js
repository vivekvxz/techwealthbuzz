import React, { useState } from 'react';
import axios from 'axios';

const UpdateItemForm = ({ item, onClose, onUpdate }) => {
    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(item.quantity);
    const [price, setPrice] = useState(item.price);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/inventory/${item.id}`, {
                name,
                quantity: Number(quantity),
                price: Number(price),
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div className="modal">
            <h2>Update Item #{item.id}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label>Price ($):</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateItemForm;