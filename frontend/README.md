# E-Commerce Project - Frontend Application

This is the frontend application for the E-Commerce Project, built using React. It interacts with the backend service to allow users to browse products, manage their accounts, shopping carts, orders, and (for sellers) manage their product listings.

## Overview

The frontend provides a dynamic and responsive user interface for the e-commerce platform. Key features include:

*   **User Authentication & Profile:**
    *   User registration (Customer or Seller) and login forms.
    *   Secure session management.
    *   Viewing and updating personal profile details.
*   **Product Discovery:**
    *   Browsing product categories.
    *   Viewing products within selected categories.
*   **Customer Experience:**
    *   **Shopping Cart:** Adding products to the cart, viewing cart contents, updating item quantities, and removing items.
    *   **Checkout Process:** Placing orders by providing shipping details and selecting payment methods (Cash on Delivery or UPI).
    *   **Order History:** Viewing a list of past orders with their status and details.
*   **Seller Dashboard:**
    *   Adding new products with details like name, description, price, and category.
    *   Viewing, editing, and deleting their own listed products.

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   **Node.js:** Version 16 or later (includes npm). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:** Version 7 or later (usually comes with Node.js).
*   **IDE (Optional):** An IDE like VS Code, WebStorm, or Atom is recommended for development.
*   **Running Backend Service:** The backend service must be running and accessible for the frontend to function correctly (see backend README for setup).

## Available Scripts

In the project directory (`frontend`), you can run:

### `npm install`

Installs all the necessary project dependencies defined in `package.json`. Run this first after cloning the repository.

### `npm start`

Runs the app in development mode.
Open http://localhost:3000 (or the next available port) to view it in your browser.

The page will reload automatically when you make code changes.
You will also see any lint errors or warnings in the console.

### `npm test`

Launches the test runner in interactive watch mode.
This executes automated tests written for the components (typically using Jest and React Testing Library).

## Backend Interaction

This frontend application relies heavily on the backend service for data and functionality. It makes HTTP requests to the backend API endpoints, such as:

*   **Authentication & User:**
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
    *   `GET /api/users/profile`
    *   `PUT /api/users/profile`
*   **Categories & Products:**
    *   `GET /api/product-categories`
    *   `GET /api/products/category/{categoryId}`
    *   `POST /api/products` (Seller: Add product)
    *   `PUT /api/products/{productId}` (Seller: Edit product)
    *   `DELETE /api/products/{productId}` (Seller: Delete product)
    *   `GET /api/products/my-products` (Seller: View own products)
*   **Shopping Cart (Customer):**
    *   `GET /api/cart`
    *   `POST /api/cart/items` (Add item)
    *   `PUT /api/cart/items/{cartItemId}` (Update quantity)
    *   `DELETE /api/cart/items/{cartItemId}` (Remove item)
*   **Orders (Customer):**
    *   `POST /api/orders` (Place order)
    *   `GET /api/orders` (View order history)

Ensure the backend service is running and accessible. The frontend is typically configured to connect to `http://localhost:8080` by default, but this can be adjusted via environment variables if needed (e.g., `REACT_APP_API_URL`).

## Technologies Used
*   React (with Hooks and Functional Components)
*   JavaScript (ES6+)
*   HTML5 / CSS3
*   npm (Package Manager)
*   Axios (for HTTP requests)
*   React Router (for client-side navigation)
*   Jest / React Testing Library (for testing - setup may vary)
