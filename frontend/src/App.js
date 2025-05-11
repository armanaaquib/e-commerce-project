import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/login/Login';
import Register from './components/register/Register';
import AddProduct from './components/product/AddProduct';
import Home from './components/Home';
import UserProfile from './components/user/UserProfile';
import EditUserProfile from './components/user/EditUserProfile';
import MyProducts from './components/product/MyProducts.js';
import EditProduct from './components/product/EditProduct.js';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username') || '');
            setUserRole(localStorage.getItem('userRole') || '');
        } else {
            setIsLoggedIn(false);
            setUsername('');
            setUserRole('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUsername('');
        setUserRole('');
    };

    return (
        <Router>
            <div className="app-container">
                <Header
                    isLoggedIn={isLoggedIn}
                    username={username}
                    userRole={userRole}
                    onLogout={handleLogout}
                />
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Login />} />
                        <Route path="/profile/edit" element={isLoggedIn ? <EditUserProfile /> : <Login />} />
                        <Route path="/my-products" element={isLoggedIn && userRole === 'Seller' ? <MyProducts /> : <Home />}/>
                        <Route path="/my-products/edit/:productId" element={isLoggedIn && userRole === 'Seller' ? <EditProduct /> : <Home />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
