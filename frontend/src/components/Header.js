import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Header.css';

function Header({ isLoggedIn, username, userRole, onLogout }) {
    return (
        <header className="app-header">
            <Link to="/" className="app-title">E-Commerce</Link>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="user-info">
                         {userRole === 'Seller' && (
                            <Link to="/my-products" className="my-products-link">My Products</Link>
                         )}
                        <Link to="/profile" className="user-profile-link" title={username}>
                            <span className="user-icon">👤</span>
                            <span className="username-display">{username}</span>
                        </Link>
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-button">Login</Link>
                        <Link to="/register" className="register-button">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
