import React from 'react';
import './ProductList.css';

function ProductList({ products, loading, error }) {
    if (loading) {
        return <p className="product-list-message">Loading products...</p>;
    }

    if (error) {
        return <p className="error-message product-list-error">{error}</p>;
    }

    if (!products || products.length === 0) {
        return <p className="product-list-message">No products found in this category.</p>;
    }

    return (
        <div className="product-list-container">
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-placeholder">
                            {/* Will Add image here when we add in backend in future */}
                            {/* <img src={product.imageUrl || '/placeholder.png'} alt={product.name} /> */}
                            <span>Image Placeholder</span>
                        </div>
                        <div className="product-info">
                            <h4 className="product-name">{product.name}</h4>
                            {product.description && (
                                <p className="product-description">{product.description}</p>
                            )}
                            <p className="product-price">Rs. {product.price.toFixed(2)}</p>
                            {/* Add to Cart functionality will implemented in next cycle */}
                            <button className="add-to-cart-button">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
