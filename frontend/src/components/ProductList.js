import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/products/category/${categoryId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="product-list-container">
            {userRole === 'SELLER' && (
                <Link to="/add-product" className="add-product-button">
                    Add Product
                </Link>
            )}
            <h2>Products</h2>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;
