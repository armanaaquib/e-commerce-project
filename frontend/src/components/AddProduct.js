import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [sellerId, setSellerId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                '/api/products/add',
                { name, description, price, categoryId, sellerId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            );
            navigate('/'); // Redirect after adding product
        } catch (error) {
            console.error('Failed to add product', error);
            alert('Failed to add product.');
        }
    };

    return (
        <div>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type = "number"
                    placeholder = "CategoryId"
                    value = {categoryId}
                    onChange = {(e)=> setCategoryId(e.target.value)}
                />
                <input
                    type = "number"
                    placeholder = "SellerId"
                    value = {sellerId}
                    onChange = {(e)=> setSellerId(e.target.value)}
                />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
