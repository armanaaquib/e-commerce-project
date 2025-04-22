import React from 'react';
import './CategoryList.css';
function CategoryList({
    categories,
    loading,
    error,
    selectedCategoryId,
    onCategorySelect,
    disabled
}) {
    if (loading) {
        return <p className="category-list-message">Loading categories...</p>;
    }

    if (error) {
        return <p className="error-message category-list-error">{error}</p>;
    }

    if (!categories || categories.length === 0) {
        return <p className="category-list-message">No categories found.</p>;
    }

    return (
        <div className="category-list">
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`category-item ${category.id === selectedCategoryId ? 'active' : ''}`}
                    onClick={() => onCategorySelect(category.id)}
                    disabled={loading || disabled}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryList;
