import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Customer');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', {
                username,
                password,
                email,
                firstName,
                lastName,
                phoneNumber,
                address,
                role
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            const errorMessage = error.response?.data?.message ||
                                 (error.response?.data && typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : null) || // Other potential error structures
                                 'Registration failed. Please check your input and try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                 <input
                    type = "email"
                    placeholder = "Email"
                    value={email}
                    onChange = {(e)=> setEmail(e.target.value)}
                    required 
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="tel" 
                    placeholder="Phone Number (10 digits)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    pattern="\d{10}"
                    title="Phone number must be 10 digits"
                />
                 <input
                    type="text"
                    placeholder="Address (Optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="Customer">Register as Customer</option>
                    <option value="Seller">Register as Seller</option>
                    <option value="Aadmin">Register as Admin</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
