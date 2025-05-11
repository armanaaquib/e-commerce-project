import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setError(null);
            try {
                const response = await axios.get('/api/product-categories');
                setCategories(response.data);
                setLoadingCategories(false);
            } catch (err) {
                console.error('Failed to fetch categories', err);
                setError('Failed to load categories. Please try again later.');
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name || !price || !categoryId) {
            setError('Please fill in all required fields (Name, Price, Category).');
            return;
        }

        try {
            const productData = {
                name,
                description,
                price: parseFloat(price),
                categoryId: parseInt(categoryId, 10)
            };

            await axios.post(
                '/api/products/',
                productData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            alert('Product added successfully!');
            navigate('/');
        } catch (err) {
            console.error('Failed to add product', err);
            const errorMessage = err.response?.data?.message || 'Failed to add product. Please check your input or try again later.';
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Enter product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        id="price"
                        type="number"
                        placeholder="Enter price (e.g., 19.99)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={loadingCategories}
                    >
                        <option value="" disabled>
                            {loadingCategories ? 'Loading categories...' : 'Select a Category'}
                        </option>
                        {!loadingCategories && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {loadingCategories && <p>Loading categories...</p>}
                </div>

                <button type="submit" disabled={loadingCategories}>Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
