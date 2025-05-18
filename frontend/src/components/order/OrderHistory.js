import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderListItem from './OrderListItem';
import './OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.message) {
            setSuccessMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
            setTimeout(() => setSuccessMessage(null), 5000);
        }

        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch order history', err);
                const errorMessage = err.response?.data?.message || 'Failed to load order history.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate, location]);

    if (loading) {
        return <div className="order-history-container"><p className="loading-message">Loading order history...</p></div>;
    }

    return (
        <div className="order-history-container">
            <h2>My Orders</h2>
            {error && <p className="error-message order-history-error">{error}</p>}
            {successMessage && <p className="success-message order-history-success">{successMessage}</p>}

            {orders.length === 0 && !loading && !error ? (
                <p className="no-orders-message">You have not placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <OrderListItem key={order.orderId} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
