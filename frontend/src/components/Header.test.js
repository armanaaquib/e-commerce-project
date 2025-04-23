import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from './Header';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
};

describe('Header Component', () => {
    test('renders title link correctly', () => {
        renderWithRouter(<Header isLoggedIn={false} username={null} onLogout={() => {}} />);
        const titleLink = screen.getByRole('link', { name: /e-commerce/i });
        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAttribute('href', '/');
    });

    test('renders Login and Register links when logged out', () => {
        renderWithRouter(<Header isLoggedIn={false} username={null} onLogout={() => {}} />);

        const loginLink = screen.getByRole('link', { name: /login/i });
        const registerLink = screen.getByRole('link', { name: /register/i });

        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');

        expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/testuser/i)).not.toBeInTheDocument();
    });

    test('renders username and Logout button when logged in', () => {
        const username = 'TestUser';
        const handleLogout = jest.fn();
        renderWithRouter(<Header isLoggedIn={true} username={username} onLogout={handleLogout} />);

        const usernameDisplay = screen.getByText(username);
        const userIcon = screen.getByTitle(username); // Check icon by title
        const logoutButton = screen.getByRole('button', { name: /logout/i });

        expect(usernameDisplay).toBeInTheDocument();
        expect(userIcon).toBeInTheDocument();
        expect(logoutButton).toBeInTheDocument();

        expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();
    });

    test('calls onLogout when Logout button is clicked', () => {
        const username = 'TestUser';
        const handleLogout = jest.fn();
        renderWithRouter(<Header isLoggedIn={true} username={username} onLogout={handleLogout} />);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        expect(handleLogout).toHaveBeenCalledTimes(1);
    });
});
