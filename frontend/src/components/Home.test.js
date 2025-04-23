import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './Home';

jest.mock('axios');

jest.mock('./prouduct/ProductList', () => ({ products, loading, error }) => (
    <div data-testid="mock-product-list">
        {loading && <span>Loading Products...</span>}
        {error && <span>Product Error: {error}</span>}
        {products && products.map(p => <div key={p.id}>{p.name}</div>)}
        {products && products.length === 0 && !loading && !error && <span>No Products Found</span>}
    </div>
));

jest.mock('./category/CategoryList', () => ({ categories, loading, error, selectedCategoryId, onCategorySelect, disabled }) => (
    <div data-testid="mock-category-list">
        {loading && <span>Loading Categories...</span>}
        {error && <span>Category Error: {error}</span>}
        {categories && categories.map(c => (
            <button
                key={c.id}
                onClick={() => onCategorySelect(c.id)}
                data-active={c.id === selectedCategoryId}
                disabled={disabled}
            >
                {c.name}
            </button>
        ))}
         {categories && categories.length === 0 && !loading && !error && <span>No Categories Found</span>}
    </div>
));

const mockCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
];

const mockProductsCategory1 = [
    { id: 101, name: 'Laptop', price: 1200 },
    { id: 102, name: 'Mouse', price: 25 },
];

const mockProductsCategory2 = [
    { id: 201, name: 'React Guide', price: 40 },
];

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
};

describe('Home Component', () => {
    beforeEach(() => {
        axios.get.mockClear();
        localStorage.clear();
    });

    test('renders loading state initially for categories', () => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return new Promise(() => {});
            }
            return Promise.resolve({ data: [] });
        });
        renderWithRouter(<Home />);
        expect(screen.getByText(/Loading Categories.../i)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-product-list')).not.toBeInTheDocument();
    });

    test('fetches categories, selects first category, and fetches products on mount', async () => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return Promise.resolve({ data: mockCategories });
            }
            if (url === `/api/products/category/${mockCategories[0].id}`) {
                return Promise.resolve({ data: mockProductsCategory1 });
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithRouter(<Home />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/product-categories');
        });
        await waitFor(() => {
             expect(axios.get).toHaveBeenCalledWith(`/api/products/category/${mockCategories[0].id}`);
        });

        expect(screen.getByRole('button', { name: 'Electronics' })).toHaveAttribute('data-active', 'true');
        expect(screen.getByRole('button', { name: 'Books' })).toHaveAttribute('data-active', 'false');
        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    test('handles category selection and fetches corresponding products', async () => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return Promise.resolve({ data: mockCategories });
            }
            if (url === `/api/products/category/${mockCategories[0].id}`) {
                return Promise.resolve({ data: mockProductsCategory1 });
            }
             if (url === `/api/products/category/${mockCategories[1].id}`) {
                return Promise.resolve({ data: mockProductsCategory2 });
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithRouter(<Home />);

        await waitFor(() => expect(screen.getByText('Laptop')).toBeInTheDocument());
        expect(axios.get).toHaveBeenCalledTimes(2);

        const booksButton = screen.getByRole('button', { name: 'Books' });
        fireEvent.click(booksButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(`/api/products/category/${mockCategories[1].id}`);
        });
         await waitFor(() => {
            expect(screen.getByText('React Guide')).toBeInTheDocument();
        });

        expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Electronics' })).toHaveAttribute('data-active', 'false');
        expect(screen.getByRole('button', { name: 'Books' })).toHaveAttribute('data-active', 'true');
        expect(axios.get).toHaveBeenCalledTimes(3);
    });

    test('displays category fetch error message', async () => {
        const categoryErrorMessage = 'Failed to load categories.';
        axios.get.mockRejectedValue(new Error('Network Error'));

        renderWithRouter(<Home />);

        await waitFor(() => {
            expect(screen.getByText(`Category Error: ${categoryErrorMessage}`)).toBeInTheDocument();
        });
        expect(screen.queryByTestId('mock-product-list')).not.toBeInTheDocument();
    });

    test('displays product fetch error message', async () => {
        const productErrorMessage = 'Could not load products for this category. Please try again.';
        axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return Promise.resolve({ data: mockCategories });
            }
            if (url === `/api/products/category/${mockCategories[0].id}`) {
                return Promise.reject(new Error('Product fetch failed'));
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithRouter(<Home />);

        await waitFor(() => {
             expect(axios.get).toHaveBeenCalledWith(`/api/products/category/${mockCategories[0].id}`);
        });
        await waitFor(() => {
            expect(screen.getByText(`Product Error: ${productErrorMessage}`)).toBeInTheDocument();
        });
    });

     test('displays message when no categories are found', async () => {
        axios.get.mockResolvedValue({ data: [] });

        renderWithRouter(<Home />);

        await waitFor(() => {
            expect(screen.getByText('No Categories Found')).toBeInTheDocument();
        });
         expect(screen.getByText(/No categories available to display products./i)).toBeInTheDocument();
         expect(screen.queryByTestId('mock-product-list')).not.toBeInTheDocument();
    });

     test('displays message when no products are found for a category', async () => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return Promise.resolve({ data: mockCategories });
            }
            if (url === `/api/products/category/${mockCategories[0].id}`) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithRouter(<Home />);

        await waitFor(() => {
             expect(axios.get).toHaveBeenCalledWith(`/api/products/category/${mockCategories[0].id}`);
        });
         await waitFor(() => {
            expect(screen.getByText('No Products Found')).toBeInTheDocument();
        });
    });

    test('renders "Add Product" button for Seller role', () => {
        localStorage.setItem('userRole', 'Seller');
        axios.get.mockResolvedValue({ data: [] });
        renderWithRouter(<Home />);
        expect(screen.getByRole('link', { name: /add product/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /add product/i })).toHaveAttribute('href', '/add-product');
    });

    test('does not render "Add Product" button for non-Seller roles', () => {
        localStorage.setItem('userRole', 'Customer');
        axios.get.mockResolvedValue({ data: [] });
        renderWithRouter(<Home />);
        expect(screen.queryByRole('link', { name: /add product/i })).not.toBeInTheDocument();
    });

     test('does not render "Add Product" button when not logged in', () => {
        axios.get.mockResolvedValue({ data: [] });
        renderWithRouter(<Home />);
        expect(screen.queryByRole('link', { name: /add product/i })).not.toBeInTheDocument();
    });

    test('disables category buttons while products are loading', async () => {
         axios.get.mockImplementation((url) => {
            if (url === '/api/product-categories') {
                return Promise.resolve({ data: mockCategories });
            }
            if (url === `/api/products/category/${mockCategories[0].id}`) {
                return Promise.resolve({ data: mockProductsCategory1 });
            }
             if (url === `/api/products/category/${mockCategories[1].id}`) {
                return new Promise(() => {});
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithRouter(<Home />);

        await waitFor(() => expect(screen.getByText('Laptop')).toBeInTheDocument());

        const booksButton = screen.getByRole('button', { name: 'Books' });
        fireEvent.click(booksButton);

        await waitFor(() => expect(screen.getByText('Loading Products...')).toBeInTheDocument());

        expect(screen.getByRole('button', { name: 'Electronics' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Books' })).toBeDisabled();
    });
});
