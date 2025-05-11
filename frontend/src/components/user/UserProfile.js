import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';
import { useNavigate, Link } from 'react-router-dom';

function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(response.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response && err.response.status === 401) {
                    setError('Session expired or invalid. Please login again.');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('username');
                    navigate('/login');
                } else {
                    setError('Failed to fetch profile data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <div className="profile-container loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="profile-container error-message">{error}</div>;
    }

    if (!profile) {
        return <div className="profile-container">No profile data found.</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-card">
                <div className="profile-detail">
                    <span className="detail-label">Username:</span>
                    <span className="detail-value">{profile.username}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{profile.email}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">First Name:</span>
                    <span className="detail-value">{profile.firstName}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">Last Name:</span>
                    <span className="detail-value">{profile.lastName}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">Phone Number:</span>
                    <span className="detail-value">{profile.phoneNumber}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{profile.address || 'N/A'}</span>
                </div>
                <div className="profile-detail">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">{profile.role}</span>
                </div>
                <Link to="/profile/edit" className="edit-profile-button">
                    Edit Profile
                </Link>
            </div>
        </div>
    );
}

export default UserProfile;
