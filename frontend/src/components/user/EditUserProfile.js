import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditUserProfile.css';

function EditUserProfile() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: ''
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get("/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { firstName, lastName, phoneNumber, address } = response.data;
                setFormData({
                    firstName: firstName || '',
                    lastName: lastName || '',
                    phoneNumber: phoneNumber || '',
                    address: address || ''
                });
            } catch (err) {
                console.error("Error fetching current profile for edit:", err);
                setError('Failed to load profile data for editing.');
                if (err.response && err.response.status === 401 || err.response.status === 403) {
                    navigate('/login');
                }
            } finally {
                setInitialLoading(false);
            }
        };
        fetchCurrentProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            setLoading(false);
            return;
        }

        const payload = {
            firstName: formData.firstName.trim() || null,
            lastName: formData.lastName.trim() || null,
            phoneNumber: formData.phoneNumber.trim() || null,
            address: formData.address.trim() || null,
        };

        try {
            await axios.put("/api/users/profile", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            console.error("Error updating profile:", err);
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Session expired. Please login again.');
                    navigate('/login');
                } else if (err.response.data && err.response.data.errors) {
                    const backendErrors = err.response.data.errors.map(e => e.defaultMessage || e.message).join(', ');
                    setError(`Update failed: ${backendErrors}`);
                } else if (err.response.data && err.response.data.message) {
                    setError(`Update failed: ${err.response.data.message}`);
                } else {
                    setError('Failed to update profile. Please try again.');
                }
            } else {
                setError('Failed to update profile. Network error or server is down.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="edit-profile-container loading">Loading form...</div>;
    }

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {error && <div className="error-message form-message">{error}</div>}
            {successMessage && <div className="success-message form-message">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g., 1234567890"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        rows="3"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => navigate('/profile')} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditUserProfile;
