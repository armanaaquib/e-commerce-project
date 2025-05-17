import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import './Cart.css';

function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState(null);

    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token || userRole !== 'Customer') {
            navigate(token ? '/' : '/login');
        }
    }, [navigate, userRole]);

    const fetchCart = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token || userRole !== 'Customer') {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setCartMessage(null);
        try {
            const response = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cartData = response.data;
            if (cartData && cartData.items) {
                cartData.items = cartData.items.map(item => ({
                    ...item,
                    unitPrice: parseFloat(item.unitPrice),
                    subtotal: parseFloat(item.subtotal)
                }));
                cartData.totalPrice = parseFloat(cartData.totalPrice);
            }
            setCart(cartData);
            if (cartData.items.length === 0) {
                setCartMessage("Your cart is empty.");
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Unauthorized or session expired. Please log in again.');
            } else {
                setError('Failed to load cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole === 'Customer') {
            fetchCart();
        }
    }, [userRole, navigate]);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        const token = localStorage.getItem('accessToken');
        if (!token || userRole !== 'Customer') {
            setError('Authentication required.');
            navigate('/login');
            return;
        }
        if (newQuantity < 1) {
            console.warn("Quantity must be at least 1.");
            return;
        }
        setError(null);

        setCart(prevCart => {
            if (!prevCart) return null;
            const updatedItems = prevCart.items.map(item =>
                item.cartItemId === cartItemId ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: item.unitPrice * newQuantity
                } : item
            );
            const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            return { ...prevCart, items: updatedItems, totalPrice: newTotalPrice, totalItems: newTotalItems };
        });

        try {
            const response = await axios.put(
                `/api/cart/items/${cartItemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedCartData = response.data;
            if (updatedCartData && updatedCartData.items) {
                updatedCartData.items = updatedCartData.items.map(item => ({
                    ...item,
                    unitPrice: parseFloat(item.unitPrice),
                    subtotal: parseFloat(item.subtotal)
                }));
                updatedCartData.totalPrice = parseFloat(updatedCartData.totalPrice);
            }
            setCart(updatedCartData);
            setCartMessage("Cart updated.");
            setTimeout(() => setCartMessage(null), 3000);
        } catch (err) {
            console.error('Failed to update cart item quantity', err);
            const errorMessage = err.response?.data?.message || 'Failed to update quantity.';
            setError(errorMessage);
            fetchCart();
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        const token = localStorage.getItem('accessToken');
        if (!token || userRole !== 'Customer') {
            setError('Authentication required.');
            navigate('/login');
            return;
        }
        if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }
        setError(null);

        setCart(prevCart => {
            if (!prevCart) return null;
            const updatedItems = prevCart.items.filter(item => item.cartItemId !== cartItemId);
            const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            return { ...prevCart, items: updatedItems, totalPrice: newTotalPrice, totalItems: newTotalItems };
        });

        try {
            const response = await axios.delete(
                `/api/cart/items/${cartItemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedCartData = response.data;
            if (updatedCartData && updatedCartData.items) {
                updatedCartData.items = updatedCartData.items.map(item => ({
                    ...item,
                    unitPrice: parseFloat(item.unitPrice),
                    subtotal: parseFloat(item.subtotal)
                }));
                updatedCartData.totalPrice = parseFloat(updatedCartData.totalPrice);
            }
            setCart(updatedCartData);
            setCartMessage("Item removed from cart.");
            if (updatedCartData && updatedCartData.items.length === 0) {
                setCartMessage("Your cart is empty.");
            }
            setTimeout(() => setCartMessage(null), 3000);
        } catch (err) {
            console.error('Failed to remove item from cart', err);
            const errorMessage = err.response?.data?.message || 'Failed to remove item.';
            setError(errorMessage);
            fetchCart();
        }
    };

    if (loading) {
        return <div className="cart-page-container"><p>Loading cart...</p></div>;
    }
    if (userRole !== 'Customer') {
        return <div className="cart-page-container"><p>Access Denied.</p></div>;
    }

    return (
        <div className="cart-page-container">
            <h2>Your Shopping Cart</h2>
            {error && <p className="error-message cart-error">{error}</p>}
            {cartMessage && <p className="success-message cart-message">{cartMessage}</p>}

            {cart && cart.items && cart.items.length > 0 ? (
                <>
                    <div className="cart-items-list">
                        {cart.items.map(item => (
                            <CartItem
                                key={item.cartItemId}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                            />
                        ))}
                    </div>
                    <div className="cart-summary">
                        <p>Total Items: <strong>{cart.totalItems}</strong></p>
                        <p>Total Price: <strong>Rs. {cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}</strong></p>
                    </div>
                </>
            ) : (
                !loading && !error && <p className="cart-empty-message">{cartMessage || "Your cart is empty."}</p>
            )}
        </div>
    );
}

export default CartPage;
