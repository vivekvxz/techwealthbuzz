import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/inventory', {
                name,
                quantity: Number(quantity),
                price: Number(price),
            });
            setName('');
            setQuantity('');
            setPrice('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <div>
            <h2>Add New Inventory Item</h2>
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
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default AddItemForm;