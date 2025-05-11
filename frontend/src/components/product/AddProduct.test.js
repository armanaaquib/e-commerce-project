import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import AddProduct from './AddProduct';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

const mockCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
];

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
};

describe('AddProduct Component', () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
        mockNavigate.mockClear();
        mockAlert.mockClear();
        localStorage.clear();
        localStorage.setItem('accessToken', 'fake-test-token'); // Assume user is logged in
    });

    test('renders initial form elements while loading categories', () => {
        axios.get.mockImplementation(() => new Promise(() => {})); // Keep promise pending

        renderWithRouter(<AddProduct />);

        expect(screen.getByRole('heading', { name: /add new product/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /category/i })).toBeDisabled();
        expect(screen.getByRole('option', { name: /loading categories.../i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add product/i })).toBeDisabled();
    });

    test('fetches categories and populates select dropdown on mount', async () => {
        axios.get.mockResolvedValue({ data: mockCategories });

        renderWithRouter(<AddProduct />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/product-categories');
        });

        expect(screen.getByRole('combobox', { name: /category/i })).toBeEnabled();
        expect(screen.getByRole('option', { name: /select a category/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /electronics/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /books/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add product/i })).toBeEnabled();
    });

    test('displays error message if fetching categories fails', async () => {
        axios.get.mockRejectedValue(new Error('Failed to fetch'));

        renderWithRouter(<AddProduct />);

        await waitFor(() => {
            expect(screen.getByText(/failed to load categories\. please try again later\./i)).toBeInTheDocument();
        });
        expect(screen.getByRole('combobox', { name: /category/i })).toBeDisabled(); // Should remain disabled on error
        expect(screen.getByRole('button', { name: /add product/i })).toBeDisabled();
    });

    test('allows user input in form fields', async () => {
        axios.get.mockResolvedValue({ data: mockCategories });
        renderWithRouter(<AddProduct />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const nameInput = screen.getByLabelText(/product name/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const priceInput = screen.getByLabelText(/price/i);
        const categorySelect = screen.getByLabelText(/category/i);

        fireEvent.change(nameInput, { target: { value: 'New Gadget' } });
        fireEvent.change(descriptionInput, { target: { value: 'A cool new gadget' } });
        fireEvent.change(priceInput, { target: { value: '99.99' } });
        fireEvent.change(categorySelect, { target: { value: '1' } }); // Select Electronics

        expect(nameInput.value).toBe('New Gadget');
        expect(descriptionInput.value).toBe('A cool new gadget');
        expect(priceInput.value).toBe('99.99');
        expect(categorySelect.value).toBe('1');
    });

    test('shows validation error if required fields are missing on submit', async () => {
        axios.get.mockResolvedValue({ data: mockCategories });
        renderWithRouter(<AddProduct />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        expect(await screen.findByText(/please fill in all required fields \(name, price, category\)\./i)).toBeInTheDocument();
        expect(axios.post).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

     test('submits form successfully with valid data', async () => {
        axios.get.mockResolvedValue({ data: mockCategories });
        axios.post.mockResolvedValue({ status: 201 }); // Simulate successful creation

        renderWithRouter(<AddProduct />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '123.45' } });
        fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '2' } }); // Select Books

        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(
                '/api/products/',
                {
                    name: 'Test Product',
                    description: '',
                    price: 123.45,
                    categoryId: 2,
                },
                { headers: { Authorization: `Bearer fake-test-token` } }
            );
        });

        expect(mockAlert).toHaveBeenCalledWith('Product added successfully!');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

     test('handles API error during product submission', async () => {
        const apiErrorMessage = 'Product name already exists';
        axios.get.mockResolvedValue({ data: mockCategories });
        axios.post.mockRejectedValue({ response: { data: { message: apiErrorMessage } } });

        renderWithRouter(<AddProduct />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Duplicate Product' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByText(apiErrorMessage)).toBeInTheDocument();
        expect(mockAlert).toHaveBeenCalledWith(apiErrorMessage);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

     test('handles generic error during product submission', async () => {
        const genericErrorMessage = 'Failed to add product. Please check your input or try again later.';
        axios.get.mockResolvedValue({ data: mockCategories });
        axios.post.mockRejectedValue(new Error('Network Error')); // Simulate non-response error

        renderWithRouter(<AddProduct />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Another Product' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByText(genericErrorMessage)).toBeInTheDocument();
        expect(mockAlert).toHaveBeenCalledWith(genericErrorMessage);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
