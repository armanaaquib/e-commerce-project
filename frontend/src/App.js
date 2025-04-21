import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
// import ProductList from './components/ProductList'; // Remove this import
import AddProduct from './components/AddProduct';
import Home from './components/Home';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username'));
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
        // Listen for storage changes to update login state across tabs (optional but good practice)
        const handleStorageChange = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setIsLoggedIn(true);
                setUsername(localStorage.getItem('username'));
            } else {
                setIsLoggedIn(false);
                setUsername('');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        // Re-check on focus in case login/logout happened in another tab
        window.addEventListener('focus', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, []); // Run only once on initial mount

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUsername('');
        // Optionally redirect to home or login page
        // window.location.href = '/login';
    };

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <Link to="/" className="app-title">E-Commerce</Link>
                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <div className="user-info">
                                <span className="user-icon">👤</span>
                                <span>{username}</span>
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="login-button">Login</Link>
                                <Link to="/register" className="register-button">Register</Link>
                            </>
                        )}
                    </div>
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Remove the ProductList route */}
                    {/* <Route path="/products/category/:categoryId" element={<ProductList />} /> */}
                    <Route path="/add-product" element={<AddProduct />} />
                    {/* Optional: Add a 404 Not Found route */}
                    {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
