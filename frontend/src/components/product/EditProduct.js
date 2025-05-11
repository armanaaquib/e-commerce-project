import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './EditProduct.css';

function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get("/api/product-categories");
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
                setError('Failed to load categories. Please try again later.');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoadingProduct(true);
            setError(null);
            if (location.state && location.state.product) {
                const { product } = location.state;
                setName(product.name || '');
                setDescription(product.description || '');
                setPrice(product.price ? product.price.toString() : '');
                setLoadingProduct(false);
            } else {
                console.warn("Product data not found in location state. Consider fetching if direct navigation is common.");
                setLoadingProduct(false);
            }
        };

        fetchProductDetails();
    }, [productId, location.state, navigate]);


    useEffect(() => {
        if (!loadingCategories && !loadingProduct && location.state && location.state.product && categories.length > 0) {
            const { product } = location.state;
            if (product.categoryName) {
                const foundCategory = categories.find(cat => cat.name === product.categoryName);
                if (foundCategory) {
                    setCategoryId(foundCategory.id.toString());
                } else {
                    console.warn(`Category '${product.categoryName}' not found in fetched categories.`);
                }
            } else if (product.categoryId) {
                setCategoryId(product.categoryId.toString());
            }
        }
    }, [loadingCategories, loadingProduct, categories, location.state]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!name || !price || !categoryId) {
            setError('Please fill in all required fields (Name, Price, Category).');
            setSubmitting(false);
            return;
        }

        try {
            const productDataToUpdate = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                categoryId: parseInt(categoryId, 10)
            };

            await axios.put(
                `/api/products/${productId}`,
                productDataToUpdate,
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            navigate('/my-products');
        } catch (err) {
            console.error('Failed to update product', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.errors?.map(e => e.defaultMessage || e.message).join(', ') || 'Failed to update product. Please check your input or try again later.';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingProduct && !(location.state && location.state.product)) {
        return <div className="edit-product-container"><p>Loading product details...</p></div>;
    }
    if (!loadingProduct && !(location.state && location.state.product) && !error) {
        return <div className="edit-product-container"><p>Product data not found. Please try navigating from "My Products" page.</p></div>;
    }

    return (
        <div className="edit-product-container">
            <h2>Edit Product (ID: {productId})</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-product-form">
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
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loadingCategories || submitting}>
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => navigate('/my-products')} className="cancel-button" disabled={submitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;
