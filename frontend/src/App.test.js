import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./components/Header', () => (props) => (
    <header data-testid="mock-header">
        Mock Header - LoggedIn: {props.isLoggedIn.toString()} - User: {props.username || 'None'}
        {props.isLoggedIn ? (
            <button onClick={props.onLogout}>Logout</button>
        ) : (
            <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
            </>
        )}
    </header>
));
jest.mock('./components/Home', () => () => <div data-testid="mock-home">Mock Home Page</div>);
jest.mock('./components/login/Login', () => () => <div data-testid="mock-login">Mock Login Page</div>);
jest.mock('./components/register/Register', () => () => <div data-testid="mock-register">Mock Register Page</div>);
jest.mock('./components/prouduct/AddProduct', () => () => <div data-testid="mock-add-product">Mock Add Product Page</div>);

const renderApp = (initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <App />
        </MemoryRouter>
    );
};


describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders Header and initial Home page by default', () => {
        renderApp(['/']);
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-home')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toHaveTextContent('LoggedIn: false');
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    test('navigates to Login page', () => {
        renderApp(['/login']);
        expect(screen.getByTestId('mock-login')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-register')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-add-product')).not.toBeInTheDocument();
    });

    test('navigates to Register page', () => {
        renderApp(['/register']);
        expect(screen.getByTestId('mock-register')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-login')).not.toBeInTheDocument();
    });

    test('navigates to Add Product page', () => {
        renderApp(['/add-product']);
        expect(screen.getByTestId('mock-add-product')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-login')).not.toBeInTheDocument();
    });

    test('shows logged-in state in Header when accessToken exists', () => {
        localStorage.setItem('accessToken', 'fake-token');
        localStorage.setItem('username', 'TestUser');
        localStorage.setItem('userRole', 'Customer');

        renderApp(['/']);

        expect(screen.getByTestId('mock-header')).toHaveTextContent('LoggedIn: true');
        expect(screen.getByTestId('mock-header')).toHaveTextContent('User: TestUser');
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
        expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });

    test('shows logged-out state in Header when accessToken is missing', () => {
        renderApp(['/']);

        expect(screen.getByTestId('mock-header')).toHaveTextContent('LoggedIn: false');
        expect(screen.getByTestId('mock-header')).toHaveTextContent('User: None');
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    test('handles logout correctly', async () => {
        localStorage.setItem('accessToken', 'fake-token');
        localStorage.setItem('username', 'TestUser');
        localStorage.setItem('userRole', 'Seller');

        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        renderApp(['/']);

        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toHaveTextContent('LoggedIn: true');
        expect(screen.getByTestId('mock-header')).toHaveTextContent('User: TestUser');

        fireEvent.click(screen.getByText('Logout'));

        await waitFor(() => {
            expect(removeItemSpy).toHaveBeenCalledWith('accessToken');
            expect(removeItemSpy).toHaveBeenCalledWith('username');
            expect(removeItemSpy).toHaveBeenCalledWith('userRole');
        });

        expect(screen.getByTestId('mock-header')).toHaveTextContent('LoggedIn: false');
        expect(screen.getByTestId('mock-header')).toHaveTextContent('User: None');
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();

        removeItemSpy.mockRestore();
    });
});
