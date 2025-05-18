import React from 'react';
import './OrderItemCard.css';

function OrderItemCard({ item }) {
    return (
        <div className="order-item-card">
            <div className="order-item-image-placeholder">
                <span>Image</span>
            </div>
            <div className="order-item-info">
                <p className="order-item-name">{item.productName}</p>
                <p className="order-item-qty-price">
                    Qty: {item.quantity} &times; Rs. {item.priceAtOrder.toFixed(2)}
                </p>
            </div>
            <p className="order-item-subtotal">Rs. {item.subtotal.toFixed(2)}</p>
        </div>
    );
}

export default OrderItemCard;
