import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
    
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('userRole', response.data.role); 
            window.location.href = '/';
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Check your credentials.');
        }
    };

    return (
        // Add the main container class
        <div className="login-container">
            <h2>Login</h2>
            {/* Add the form class */}
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required // Add basic validation
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required // Add basic validation
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
