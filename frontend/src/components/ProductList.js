import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductList.css'; // Ensure this CSS file exists or create it

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState(''); // Optional: To display category name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchProductsAndCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch products for the category
                const productsResponse = await axios.get(`/api/products/category/${categoryId}`, {
                    // No token needed if product listing is public, add if required
                    // headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setProducts(productsResponse.data);

                // Optional: Fetch category details to display the name
                // This assumes an endpoint like /api/product-categories/{id} exists
                try {
                    const categoryResponse = await axios.get(`/api/product-categories/${categoryId}`);
                    setCategoryName(categoryResponse.data.name);
                } catch (catError) {
                    console.warn('Could not fetch category name', catError);
                    setCategoryName('Selected Category'); // Fallback name
                }

            } catch (err) {
                console.error('Failed to fetch products', err);
                setError('Could not load products. Please try again later.');
                setProducts([]); // Clear products on error
            } finally {
                setLoading(false);
            }
        };
        fetchProductsAndCategory();
    }, [categoryId]); // Re-run effect if categoryId changes

    return (
        <div className="product-list-container">
            {/* Display category name if available */}
            <h2>{loading ? 'Loading Products...' : `${categoryName} Products`}</h2>

            {error && <p className="error-message">{error}</p>}

            {loading && <p>Loading...</p> /* Optional loading indicator */}

            {!loading && !error && products.length === 0 && (
                <p>No products found in this category.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            {/* Placeholder for an image - Add img tag when image URLs are available */}
                            <div className="product-image-placeholder">
                                <span>Image Placeholder</span>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                {/* Display description if available in the API response */}
                                {product.description && <p className="product-description">{product.description}</p>}
                                <p className="product-price">Rs. {product.price.toFixed(2)}</p> {/* Format price */}
                                {/* Add to Cart Button (Example) */}
                                <button className="add-to-cart-button">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;
