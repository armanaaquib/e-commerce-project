import React from 'react';
import './ProductList.css';

function ProductList({ products, loading, error, isSellerView = false, onProductDelete }) {
    if (loading) {
        return <p className="product-list-message">Loading products...</p>;
    }

    if (error) {
        return <p className="error-message product-list-error">{error}</p>;
    }

    if (!products || products.length === 0) {
        const message = isSellerView ? "No products found." : "No products found in this category.";
        return <p className="product-list-message">{message}</p>;
    }

    const handleDeleteClick = (productId) => {
        if (onProductDelete) {
            onProductDelete(productId);
        }
    };

    return (
        <div className="product-list-container">
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-placeholder">
                            <span>Image Placeholder</span>
                        </div>
                        <div className="product-info">
                            <h4 className="product-name">{product.name}</h4>
                            {product.description && (
                                <p className="product-description">{product.description}</p>
                            )}
                            <p className="product-price">Rs. {product.price.toFixed(2)}</p>
                            {isSellerView ? (
                                <div className="seller-actions">
                                    {/* Add Edit button later if needed */}
                                    {/* <button className="edit-product-button">Edit</button> */}
                                    <button 
                                        onClick={() => handleDeleteClick(product.id)} 
                                        className="delete-product-button"
                                        title="Delete Product"
                                   > Delete </button>
                                </div>
                            ) : (
                                <button className="add-to-cart-button">Add to Cart</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
