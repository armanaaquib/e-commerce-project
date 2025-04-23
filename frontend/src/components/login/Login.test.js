import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from './Login';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const originalLocation = window.location;
beforeAll(() => {
    delete window.location;
    window.location = { href: '' };
});
afterAll(() => {
    window.location = originalLocation;
});

const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Login Component', () => {
    beforeEach(() => {
        axios.post.mockClear();
        mockAlert.mockClear();
        localStorage.clear();
        window.location.href = '';
    });

    test('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('allows user to input username and password', () => {
        render(<Login />);
        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    test('handles successful login', async () => {
        const mockLoginData = {
            accessToken: 'fake-token-123',
            username: 'testuser',
            role: 'Customer',
        };
        axios.post.mockResolvedValue({ data: mockLoginData });

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
                username: 'testuser',
                password: 'password123',
            });
        });

        expect(localStorage.getItem('accessToken')).toBe(mockLoginData.accessToken);
        expect(localStorage.getItem('username')).toBe(mockLoginData.username);
        expect(localStorage.getItem('userRole')).toBe(mockLoginData.role);
        expect(window.location.href).toBe('/');
        expect(mockAlert).not.toHaveBeenCalled();
    });

    test('handles failed login', async () => {
        const errorMessage = 'Login failed. Check your credentials.';
        axios.post.mockRejectedValue(new Error('Network Error'));

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
                username: 'wronguser',
                password: 'wrongpass',
            });
        });

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('username')).toBeNull();
        expect(localStorage.getItem('userRole')).toBeNull();
        expect(window.location.href).toBe('');
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(errorMessage);
    });

    test('requires username and password fields', async () => {
        render(<Login />);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.click(loginButton);

        await waitFor(() => {
             expect(axios.post).not.toHaveBeenCalled();
        });

         expect(mockAlert).not.toHaveBeenCalled();

         fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
         fireEvent.click(loginButton);
         await waitFor(() => {
             expect(axios.post).not.toHaveBeenCalled();
         });

         fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: '' } });
         fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
         fireEvent.click(loginButton);
         await waitFor(() => {
             expect(axios.post).not.toHaveBeenCalled();
         });
    });
});
