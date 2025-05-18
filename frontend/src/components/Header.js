import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, username, userRole, onLogout }) {
    return (
        <header className="app-header">
            <Link to="/" className="app-title">E-Commerce</Link>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="user-info">
                         {userRole === 'Customer' && (
                            <>
                                <Link to="/cart" className="cart-link nav-link-style">My Cart</Link>
                                <Link to="/order-history" className="nav-link-style">My Orders</Link>
                            </>
                         )}
                         {userRole === 'Seller' && (
                            <Link to="/my-products" className="my-products-link nav-link-style">My Products</Link>
                         )}
                        <Link to="/profile" className="user-profile-link nav-link-style" title={username}>
                            <span className="user-icon">👤</span>
                            <span className="username-display">{username}</span>
                        </Link>
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-button nav-link-style">Login</Link>
                        <Link to="/register" className="register-button nav-link-style">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
