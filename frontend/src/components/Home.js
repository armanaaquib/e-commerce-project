import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Keep Link for Add Product button
import './Home.css';

function Home() {
    // Category State
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState(null);

    // Product State
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(false); // Initially false, true when fetching
    const [productError, setProductError] = useState(null);

    const userRole = localStorage.getItem('userRole');

    // --- Effects ---

    // Effect 1: Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setCategoryError(null);
            try {
                const response = await axios.get('/api/product-categories');
                setCategories(response.data);
                // *** Automatically select the first category if available ***
                if (response.data && response.data.length > 0) {
                    setSelectedCategoryId(response.data[0].id); // Set the first category as selected
                } else {
                    // Handle case with no categories
                    setProducts([]); // Ensure products are cleared if no categories exist
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
                setCategoryError('Failed to load categories.');
                setProducts([]); // Clear products on category fetch error
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []); // Runs only once on mount

    // Effect 2: Fetch Products when selectedCategoryId changes (and is not null)
    useEffect(() => {
        // Only fetch if a category is selected and categories are loaded
        if (selectedCategoryId !== null && !loadingCategories) {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                setProductError(null);
                setProducts([]); // Clear previous products before fetching new ones
                try {
                    const response = await axios.get(`/api/products/category/${selectedCategoryId}`);
                    setProducts(response.data);
                } catch (err) {
                    console.error(`Failed to fetch products for category ${selectedCategoryId}`, err);
                    setProductError('Could not load products for this category. Please try again.');
                    setProducts([]); // Clear products on error
                } finally {
                    setLoadingProducts(false);
                }
            };
            fetchProducts();
        }
    }, [selectedCategoryId, loadingCategories]); // Re-run when selectedCategoryId changes or categories finish loading

    // --- Handlers ---
    const handleCategoryClick = (categoryId) => {
        if (categoryId !== selectedCategoryId) {
            setSelectedCategoryId(categoryId);
            // Fetching is handled by the useEffect hook watching selectedCategoryId
        }
    };

    // --- Render ---
    return (
        <div className="home-container">
            {/* --- Categories Section --- */}
            <h2>Categories</h2>
            {loadingCategories && <p>Loading categories...</p>}
            {categoryError && <p className="error-message">{categoryError}</p>}
            {!loadingCategories && !categoryError && (
                <div className="category-list">
                    {categories.length === 0 ? (
                        <p>No categories found.</p>
                    ) : (
                        categories.map((category) => (
                            <button
                                key={category.id}
                                // Use button instead of Link for same-page interaction
                                className={`category-item ${category.id === selectedCategoryId ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.id)}
                                disabled={loadingProducts} // Disable while products are loading
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* --- Add Product Button (Conditional) --- */}
            {userRole === 'Seller' && (
                <Link to="/add-product" className="add-product-button home-add-product">
                    Add Product
                </Link>
            )}

            {/* --- Products Section --- */}
            <div className="products-section">
                <h3>Products</h3>
                {/* Show loading/error specific to products */}
                {loadingProducts && <p>Loading products...</p>}
                {productError && <p className="error-message">{productError}</p>}

                {/* Show products only if not loading, no error, and a category is selected */}
                {!loadingProducts && !productError && selectedCategoryId !== null && (
                    <>
                        {products.length === 0 ? (
                            <p>No products found in this category.</p>
                        ) : (
                            <div className="product-grid">
                                {products.map((product) => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-image-placeholder">
                                            <span>Image Placeholder</span>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name">{product.name}</h4>
                                            {product.description && <p className="product-description">{product.description}</p>}
                                            <p className="product-price">Rs. {product.price.toFixed(2)}</p>
                                            <button className="add-to-cart-button">Add to Cart</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
                {/* Handle case where no category could be selected initially */}
                {!loadingCategories && selectedCategoryId === null && !categoryError && (
                     <p>Select a category to view products.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
