import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
};

describe('Register Component', () => {
    beforeEach(() => {
        axios.post.mockClear();
        mockNavigate.mockClear();
        mockAlert.mockClear();
    });

    test('renders registration form correctly', () => {
        renderWithRouter(<Register />);
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/address/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /register as customer/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /register as seller/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /register as admin/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('allows user to input data into form fields', () => {
        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'newpass123' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText(/address/i), { target: { value: '123 Test St' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Seller' } });

        expect(screen.getByPlaceholderText(/username/i).value).toBe('newuser');
        expect(screen.getByPlaceholderText(/^password$/i).value).toBe('newpass123');
        expect(screen.getByPlaceholderText(/email/i).value).toBe('test@example.com');
        expect(screen.getByPlaceholderText(/first name/i).value).toBe('Test');
        expect(screen.getByPlaceholderText(/last name/i).value).toBe('User');
        expect(screen.getByPlaceholderText(/phone number/i).value).toBe('1234567890');
        expect(screen.getByPlaceholderText(/address/i).value).toBe('123 Test St');
        expect(screen.getByRole('combobox').value).toBe('Seller');
    });

    test('handles successful registration', async () => {
        axios.post.mockResolvedValue({ status: 201 });

        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'gooduser' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'goodpass' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'good@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'Good' } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Customer' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
                username: 'gooduser',
                password: 'goodpass',
                email: 'good@example.com',
                firstName: 'Good',
                lastName: 'User',
                phoneNumber: '',
                address: '',
                role: 'Customer',
            });
        });

        expect(mockAlert).toHaveBeenCalledWith('Registration successful! Please login.');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('handles registration failure with specific error message', async () => {
        const errorMessage = 'Username already exists';
        axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'existinguser' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'somepass' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'exist@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'Exist' } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Customer' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(mockAlert).toHaveBeenCalledWith(errorMessage);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

     test('handles registration failure with generic error message', async () => {
        const genericErrorMessage = 'Registration failed. Please check your input and try again.';
        axios.post.mockRejectedValue(new Error('Network Error')); // Simulate non-response error

        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'erroruser' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'errorpass' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'error@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'Error' } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Customer' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(mockAlert).toHaveBeenCalledWith(genericErrorMessage);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('does not submit if required fields are missing', async () => {
         renderWithRouter(<Register />);
         const registerButton = screen.getByRole('button', { name: /register/i });

         fireEvent.click(registerButton);

         await waitFor(() => {
              expect(axios.post).not.toHaveBeenCalled();
         });
         expect(mockAlert).not.toHaveBeenCalled();
         expect(mockNavigate).not.toHaveBeenCalled();

         // Fill some but not all required fields
         fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'partialuser' } });
         fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'partialpass' } });
         fireEvent.click(registerButton);

         await waitFor(() => {
              expect(axios.post).not.toHaveBeenCalled();
         });
         expect(mockAlert).not.toHaveBeenCalled();
         expect(mockNavigate).not.toHaveBeenCalled();
    });
});
