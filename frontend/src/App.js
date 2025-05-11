import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/login/Login';
import Register from './components/register/Register';
import AddProduct from './components/prouduct/AddProduct';
import Home from './components/Home';
import UserProfile from './components/user/UserPorfile.js';
import './App.css'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username') || '');
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <Router>
            <div className="app-container">
                <Header
                    isLoggedIn={isLoggedIn}
                    username={username}
                    onLogout={handleLogout}
                />
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Login />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
