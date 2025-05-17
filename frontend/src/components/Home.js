import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './product/ProductList';
import CategoryList from './category/CategoryList';
import './Home.css';

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

    // Add state for Add to Cart success/error messages
    const [addToCartMessage, setAddToCartMessage] = useState(null);
    const [addToCartError, setAddToCartError] = useState(null);

    const userRole = localStorage.getItem('userRole');

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setCategoryError(null);
            setProductError(null);
            setProducts([]);
            setSelectedCategoryId(null);
            try {
                const response = await axios.get('/api/product-categories');
                setCategories(response.data);
                if (response.data && response.data.length > 0) {
                    setSelectedCategoryId(response.data[0].id);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
                setCategoryError('Failed to load categories.');
                setProducts([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products when selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId !== null && !loadingCategories) {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                setProductError(null);
                setProducts([]);
                setAddToCartMessage(null);
                setAddToCartError(null);

                try {
                    const response = await axios.get(`/api/products/category/${selectedCategoryId}`);
                    setProducts(response.data);
                } catch (err) {
                    console.error(`Failed to fetch products for category ${selectedCategoryId}`, err);
                    setProductError('Could not load products for this category. Please try again.');
                    setProducts([]);
                } finally {
                    setLoadingProducts(false);
                }
            };
            fetchProducts();
        } else if (selectedCategoryId === null && !loadingCategories && categories.length > 0) {
             setProducts([]);
             setProductError(null);
        }
    }, [selectedCategoryId, loadingCategories, categories]);

    const handleCategorySelect = (categoryId) => {
        if (categoryId !== selectedCategoryId) {
            setSelectedCategoryId(categoryId);
        }
    };

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setAddToCartError('Please log in to add items to your cart.');
            return;
        }

        setAddToCartMessage(null);
        setAddToCartError(null);

        try {
            const quantity = 1;
            const response = await axios.post(
                "/api/cart/items",
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Item added to cart:', response.data);
            setAddToCartMessage('Product added to cart!');
        } catch (err) {
            console.error('Failed to add item to cart', err);
            const errorMessage = err.response?.data?.message || 'Failed to add product to cart.';
            setAddToCartError(errorMessage);
        }
    };

    return (
        <div className="home-container">
            <h2>Categories</h2>
            <CategoryList
                categories={categories}
                loading={loadingCategories}
                error={categoryError}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
                disabled={loadingProducts}
            />

            <div className="products-section">
                 <h3>Products</h3>

                 {addToCartMessage && <p className="success-message" style={{textAlign: 'center'}}>{addToCartMessage}</p>}
                 {addToCartError && <p className="error-message" style={{textAlign: 'center'}}>{addToCartError}</p>}

                 {!loadingCategories && !categoryError && selectedCategoryId !== null && (
                    <ProductList
                        products={products}
                        loading={loadingProducts}
                        error={productError}
                        userRole={userRole}
                        onAddToCart={userRole === 'Customer' ? handleAddToCart : null}
                    />
                 )}
                 {!loadingCategories && selectedCategoryId === null && !categoryError && categories.length > 0 && (
                     <p className="product-list-message">Select a category to view products.</p>
                 )}
                 {!loadingCategories && categories.length === 0 && !categoryError && (
                     <p className="product-list-message">No categories available to display products.</p>
                 )}
            </div>
        </div>
    );
}

export default Home;
