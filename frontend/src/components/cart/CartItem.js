import React, { useState, useEffect } from 'react';
import './CartItem.css';

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
        if (newQuantity === '' || /^[0-9]*$/.test(newQuantity)) {
            setQuantity(newQuantity);
        }
    };

    const handleBlur = async () => {
        let newQuantity = parseInt(quantity, 10);

        if (isNaN(newQuantity) || newQuantity < 1) {
            setQuantity(item.quantity);
            return;
        }

        if (newQuantity !== item.quantity) {
            setIsUpdating(true);
            try {
                await onUpdateQuantity(item.cartItemId, newQuantity);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleRemoveClick = async () => {
        setIsUpdating(true);
        try {
            await onRemoveItem(item.cartItemId);
        } finally {
            setIsUpdating(false);
        }
    };

    const currentQuantity = parseInt(quantity, 10);
    const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice);

    const subtotal = (!isNaN(unitPrice) && !isNaN(currentQuantity) && currentQuantity > 0)
        ? (unitPrice * currentQuantity)
        : 0;

    return (
        <div className="cart-item">
            <div className="cart-item-image-placeholder">
                 <span>Image</span>
            </div>
            <div className="cart-item-details">
                <h4 className="cart-item-name">{item.productName}</h4>
                {item.productDescription && (
                     <p className="cart-item-description">{item.productDescription}</p>
                )}
                <p className="cart-item-price">Unit Price: Rs. {!isNaN(unitPrice) ? unitPrice.toFixed(2) : 'N/A'}</p>
            </div>
            <div className="cart-item-quantity-controls">
                 <label htmlFor={`quantity-${item.cartItemId}`}>Quantity:</label>
                 <input
                     id={`quantity-${item.cartItemId}`}
                     type="number"
                     min="1"
                     value={quantity}
                     onChange={handleQuantityChange}
                     onBlur={handleBlur}
                     disabled={isUpdating}
                 />
            </div>
            <div className="cart-item-subtotal">
                 <p>Subtotal: <strong>Rs. {subtotal.toFixed(2)}</strong></p>
            </div>
            <div className="cart-item-actions">
                <button onClick={handleRemoveClick} className="remove-item-button" disabled={isUpdating}>
                    {isUpdating ? 'Removing...' : 'Remove'}
                </button>
            </div>
        </div>
    );
}

export default CartItem;
