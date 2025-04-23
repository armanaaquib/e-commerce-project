import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from './ProductList';

const mockProducts = [
    { id: 1, name: 'Laptop Pro', description: 'High-end laptop', price: 1200.00 },
    { id: 2, name: 'Wireless Mouse', description: null, price: 25.50 },
    { id: 3, name: 'Mechanical Keyboard', description: 'Clicky keys', price: 75.99 },
];

describe('ProductList Component', () => {
    test('renders loading message when loading is true', () => {
        render(<ProductList products={[]} loading={true} error={null} />);
        expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();
        expect(screen.queryByText(/No products found/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Laptop Pro/i })).not.toBeInTheDocument();
    });

    test('renders error message when error is provided', () => {
        const errorMessage = 'Failed to fetch products';
        render(<ProductList products={[]} loading={false} error={errorMessage} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toHaveClass('error-message');
        expect(screen.queryByText(/Loading products.../i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No products found/i)).not.toBeInTheDocument();
    });

    test('renders "No products found" message when products array is empty', () => {
        render(<ProductList products={[]} loading={false} error={null} />);
        expect(screen.getByText(/No products found in this category./i)).toBeInTheDocument();
        expect(screen.queryByText(/Loading products.../i)).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Laptop Pro/i })).not.toBeInTheDocument();
    });

    test('renders "No products found" message when products prop is null', () => {
        render(<ProductList products={null} loading={false} error={null} />);
        expect(screen.getByText(/No products found in this category./i)).toBeInTheDocument();
    });

    test('renders product cards correctly when products are provided', () => {
        render(<ProductList products={mockProducts} loading={false} error={null} />);

        expect(screen.queryByText(/Loading products.../i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No products found/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Failed to fetch/i)).not.toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Laptop Pro/i })).toBeInTheDocument();
        expect(screen.getByText(/High-end laptop/i)).toBeInTheDocument();
        expect(screen.getByText(/Rs. 1200.00/i)).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Wireless Mouse/i })).toBeInTheDocument();
        expect(screen.queryByText(/description for mouse/i)).not.toBeInTheDocument(); // Check description is optional
        expect(screen.getByText(/Rs. 25.50/i)).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument();
        expect(screen.getByText(/Clicky keys/i)).toBeInTheDocument();
        expect(screen.getByText(/Rs. 75.99/i)).toBeInTheDocument();

        const addToCartButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
        expect(addToCartButtons).toHaveLength(mockProducts.length);

        const imagePlaceholders = screen.getAllByText(/Image Placeholder/i);
        expect(imagePlaceholders).toHaveLength(mockProducts.length);
    });

    test('renders correct price format', () => {
        const singleProduct = [{ id: 4, name: 'Test Product', price: 50 }];
        render(<ProductList products={singleProduct} loading={false} error={null} />);
        expect(screen.getByText(/Rs. 50.00/i)).toBeInTheDocument();
    });
});
