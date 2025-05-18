import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const PAYMENT_METHODS = [
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'NET_BANKING', label: 'Net Banking' },
    { value: 'UPI', label: 'UPI' },
    { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' }
];

function Checkout() {
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
    const [paymentDetails, setPaymentDetails] = useState(''); // Optional

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0); // To display cart total

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    // Fetch cart total to display (optional, but good UX)
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
                    // Cart is empty, redirect back to cart page or home
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
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
            paymentDetails: paymentDetails || null // Send null if empty
        };

        try {
            const response = await axios.post(`${apiUrl}/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Order placed:', response.data);
            // On successful order, navigate to order history or a confirmation page
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
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    >
                        {PAYMENT_METHODS.map(method => (
                            <option key={method.value} value={method.value}>
                                {method.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="paymentDetails">Payment Details (Optional)</label>
                    <input
                        type="text"
                        id="paymentDetails"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        placeholder="e.g., Card ending in XXXX, UPI ID"
                    />
                </div>

                <button type="submit" className="place-order-button" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}

export default Checkout;
