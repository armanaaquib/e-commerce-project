import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import { useNavigate, Link } from 'react-router-dom';
import './MyProducts.css';

function MyProducts() {
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deletingProductId, setDeletingProductId] = useState(null);
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');

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

     const handleProductDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setDeleteError('Authentication token not found. Please log in again.');
            navigate('/login');
            return;
        }

        setDeletingProductId(productId);
        setDeleteError('');

        try {
            await axios.delete(`api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        } catch (err) {
            console.error("Error deleting product:", err);
            if (err.response) {
                 if (err.response.status === 401 || err.response.status === 403) {
                    setDeleteError('Unauthorized to delete this product or session expired.');
                } else {
                    setDeleteError(err.response.data?.message || 'Failed to delete product. Please try again.');
                }
            } else {
                setDeleteError('Network error or server is unavailable.');
            }
        } finally {
            setDeletingProductId(null);
        }
     };

     const handleProductEdit = (productToEdit) => {
        navigate(`/my-products/edit/${productToEdit.id}`, { state: { product: productToEdit } });
     };

    return (
        <div className="my-products-page-container">
            <div className="my-products-header">
                <h2>My Products</h2>
                <Link to="/add-product" className="add-product-button my-products-add-button">
                    Add New Product
                </Link>
            </div>

            {deleteError && <p className="error-message product-list-error" style={{textAlign: 'center', marginBottom: '15px'}}>{deleteError}</p>}

            <ProductList
                products={myProducts}
                loading={loading}
                error={error}
                userRole={userRole}
                onProductDelete={handleProductDelete}
                onProductEdit={handleProductEdit}
            />
        </div>
    );
}

export default MyProducts;
