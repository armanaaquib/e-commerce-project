import React, { useState } from 'react';
import OrderItemCard from './OrderItemCard'; // We'll create this next
import './OrderListItem.css'; // We'll create this

function OrderListItem({ order }) {
    const [showDetails, setShowDetails] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="order-list-item">
            <div className="order-summary-header" onClick={() => setShowDetails(!showDetails)}>
                <div className="order-info">
                    <span className="order-id">Order ID: #{order.orderId}</span>
                    <span className="order-date">Placed: {formatDate(order.createdAt)}</span>
                </div>
                <div className="order-meta">
                    <span className={`order-status status-${order.orderStatus?.toLowerCase()}`}>{order.orderStatus}</span>
                    <span className="order-total">Total: Rs. {order.totalAmount.toFixed(2)}</span>
                </div>
                <button className="toggle-details-button">
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {showDetails && (
                <div className="order-details-content">
                    <h4>Order Details</h4>
                    <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                    <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod?.replace('_', ' ')}</p>
                    {order.paymentDetails && <p><strong>Payment Info:</strong> {order.paymentDetails}</p>}

                    <h5>Items:</h5>
                    <div className="order-items-grid">
                        {order.items && order.items.map(item => (
                            <OrderItemCard key={item.orderItemId} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderListItem;
