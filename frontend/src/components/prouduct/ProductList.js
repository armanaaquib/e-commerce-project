import React from 'react';
import './ProductList.css'; // Import the new CSS file

function ProductList({ products, loading, error }) {
    // Handle Loading State
    if (loading) {
        return <p className="product-list-message">Loading products...</p>;
    }

    // Handle Error State
    if (error) {
        return <p className="error-message product-list-error">{error}</p>;
    }

    // Handle No Products Found
    if (!products || products.length === 0) {
        return <p className="product-list-message">No products found in this category.</p>;
    }

    // Render Product Grid
    return (
        <div className="product-list-container">
            {/* You can optionally keep the H3 heading here or in the parent */}
            {/* <h3>Products</h3> */}
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        {/* Basic Image Placeholder - Replace with actual image later */}
                        <div className="product-image-placeholder">
                            {/* In a real app, you'd have an <img> tag here */}
                            {/* <img src={product.imageUrl || '/placeholder.png'} alt={product.name} /> */}
                            <span>Image Placeholder</span>
                        </div>
                        <div className="product-info">
                            <h4 className="product-name">{product.name}</h4>
                            {product.description && (
                                <p className="product-description">{product.description}</p>
                            )}
                            <p className="product-price">Rs. {product.price.toFixed(2)}</p>
                            {/* Add to Cart functionality would likely involve context or prop drilling */}
                            <button className="add-to-cart-button">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
