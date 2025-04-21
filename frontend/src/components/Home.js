import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductList from './prouduct/ProductList';
import './Home.css'; // Keep Home.css for category styles etc.

function Home() {
    // Category State
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState(null);

    // Product State
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState(null);

    const userRole = localStorage.getItem('userRole');

    // --- Effects ---

    // Effect 1: Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setCategoryError(null);
            setProductError(null); // Reset product error when fetching categories
            setProducts([]); // Clear products when categories reload
            setSelectedCategoryId(null); // Reset selected category
            try {
                const response = await axios.get('/api/product-categories');
                setCategories(response.data);
                // Automatically select the first category if available
                if (response.data && response.data.length > 0) {
                    setSelectedCategoryId(response.data[0].id); // Set the first category as selected
                } else {
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
        } else if (selectedCategoryId === null && !loadingCategories && categories.length > 0) {
            // If categories loaded but none is selected (e.g., after an error or initial load issue)
            // Optionally clear products or show a specific message
             setProducts([]);
             setProductError(null); // Clear any previous product error
        }
    }, [selectedCategoryId, loadingCategories, categories]); // Add categories dependency

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
                                className={`category-item ${category.id === selectedCategoryId ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.id)}
                                disabled={loadingProducts || loadingCategories} // Disable while loading either
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
                 {/* Keep the H3 heading in Home or move it to ProductList */}
                 <h3>Products</h3>

                {/* Conditionally render ProductList or messages */}
                {!loadingCategories && !categoryError && selectedCategoryId !== null && (
                    <ProductList
                        products={products}
                        loading={loadingProducts}
                        error={productError}
                    />
                )}

                {/* Message when no category is selected (and categories have loaded) */}
                {!loadingCategories && selectedCategoryId === null && !categoryError && categories.length > 0 && (
                     <p className="product-list-message">Select a category to view products.</p>
                )}

                 {/* Message when categories loaded but there are none */}
                 {!loadingCategories && categories.length === 0 && !categoryError && (
                     <p className="product-list-message">No categories available to display products.</p>
                 )}
            </div>
        </div>
    );
}

export default Home;
