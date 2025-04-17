import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/product-categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="home-container">
            <h2>Categories</h2>
            <div className="category-list">
                {categories.map((category) => (
                    <Link to={`/products/category/${category.id}`} key={category.id} className="category-item">
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
