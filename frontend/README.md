# E-Commerce Project - Frontend Application

This is the frontend application for the E-Commerce Project, built using React. It interacts with the backend service to allow users to browse products, manage their accounts, and (for sellers) add new products.

## Overview

The frontend provides the user interface for the e-commerce platform. Key features include:

*   User registration and login forms.
*   Browsing product categories and products.
*   Viewing product details.
*   (For Sellers) Interface to add and manage products.

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   **Node.js:** Version  16 or later (includes npm). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:** Version 7 or later (usually comes with Node.js).
*   **IDE (Optional):** An IDE like VS Code, WebStorm, or Atom  is recommended for development.
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

*   `POST /api/auth/register`
*   `POST /api/auth/login`
*   `GET /api/product-categories`
*   `GET /api/products/category/{categoryId}`
*   `POST /api/products` (with authentication token)

Ensure the backend service is running and accessible.

## Technologies Used
*   React
*   JavaScript (ES6+)
*   HTML5 / CSS3
*   npm (Package  Manager)
*   Axios for HTTP requests
*   React Router (for navigation)
*   Jest / React Testing Library (for testing)
