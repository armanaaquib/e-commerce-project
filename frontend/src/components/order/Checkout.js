import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const PAYMENT_METHODS = [
    { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
    { value: 'UPI', label: 'UPI' }
];

function Checkout() {
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
    const [upiId, setUpiId] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        const fetchCartSummary = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${apiUrl}/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data && response.data.items.length > 0) {
                    setCartTotal(parseFloat(response.data.totalPrice));
                } else {
                    setError("Your cart is empty. Cannot proceed to checkout.");
                    setTimeout(() => navigate('/cart'), 3000);
                }
            } catch (err) {
                console.error("Failed to fetch cart summary", err);
                setError("Could not load cart summary. Please try again.");
            }
        };
        fetchCartSummary();
    }, [apiUrl, navigate]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value !== 'UPI') {
            setUpiId('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'UPI' && !upiId.trim()) {
            setError('Please enter your UPI ID for UPI payment.');
            return;
        }

        setLoading(true);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            setLoading(false);
            return;
        }

        const orderData = {
            shippingAddress,
            phoneNumber,
            paymentMethod,
            paymentDetails: paymentMethod === 'UPI' ? upiId : null
        };

        try {
            const response = await axios.post(`${apiUrl}/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Order placed:', response.data);
            navigate('/order-history', { state: { message: 'Order placed successfully!' } });
        } catch (err) {
            console.error('Failed to place order', err);
            const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-container">
            <h2>Checkout</h2>
            {error && <p className="error-message checkout-error">{error}</p>}

            <div className="order-summary-preview">
                <h4>Order Total: Rs. {cartTotal.toFixed(2)}</h4>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label htmlFor="shippingAddress">Shipping Address</label>
                    <textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        rows="4"
                        placeholder="Enter your full shipping address"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="e.g., +91-9876543210"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        required
                    >
                        {PAYMENT_METHODS.map(method => (
                            <option key={method.value} value={method.value}>
                                {method.label}
                            </option>
                        ))}
                    </select>
                </div>

                {paymentMethod === 'UPI' && (
                    <div className="form-group">
                        <label htmlFor="upiId">UPI ID</label>
                        <input
                            type="text"
                            id="upiId"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter your UPI ID (e.g., yourname@bank)"
                            required={paymentMethod === 'UPI'}
                        />
                    </div>
                )}

                <button type="submit" className="place-order-button" disabled={loading || cartTotal === 0}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}

export default Checkout;
