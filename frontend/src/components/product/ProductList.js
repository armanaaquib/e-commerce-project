import React from 'react';
import './ProductList.css';

function ProductList({ products, loading, error, isSellerView = false, onProductDelete, onProductEdit }) {
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

    const handleEditClick = (product) => {
        if (onProductEdit) {
            onProductEdit(product);
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
                                     <button
                                        onClick={() => handleEditClick(product)}
                                        className="edit-product-button"
                                        title="Edit Product"
                                     >
                                        Edit
                                     </button>
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
