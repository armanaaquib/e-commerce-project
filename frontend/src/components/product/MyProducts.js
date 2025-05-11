import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';
import './MyProducts.css';

function MyProducts() {
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyProducts = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication required.');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError('');
                const response = await axios.get("/api/products/my-products", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMyProducts(response.data);
            } catch (err) {
                console.error("Error fetching seller's products:", err);
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Unauthorized or session expired. Please login again as a seller.');
                    } else {
                        setError(err.response.data?.message || 'Failed to fetch your products.');
                    }
                } else {
                    setError('Network error or server is unavailable.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyProducts();
    }, []);

    return (
        <div className="my-products-page-container">
            <h2>My Products</h2>
            <ProductList products={myProducts} loading={loading} error={error} />
            {!loading && !error && myProducts.length === 0 && (
                <p className="product-list-message my-products-empty-message">
                    You haven't added any products yet.
                </p>
            )}
        </div>
    );
}

export default MyProducts;
