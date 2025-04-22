import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, username, onLogout }) {
    return (
        <header className="app-header">
            <Link to="/" className="app-title">E-Commerce</Link>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="user-info">
                        <span className="user-icon" title={username}>👤</span>
                        <span className="username-display">{username}</span>
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
