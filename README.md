# E-Commerce Project

This repository contains the source code for a full-stack E-Commerce application, designed to provide a platform for browsing and selling products online. It consists of a Spring Boot backend service and a React frontend application.

## Overview

This project implements a functional e-commerce platform with distinct functionalities for Customers and Sellers, built upon a common user management system.

**Key Features:**

*   **User Management & Common Functionalities:**
    *   **Registration:** New users can sign up as either a "Customer" or a "Seller".
    *   **Authentication:** Secure login for all registered users using JWT-based authentication.
    *   **Profile Management:** Authenticated users can view and update their personal details.

*   **Customer Functionalities:**
    *   **Product Discovery:** Browse and view products, filterable by various categories.
    *   **Shopping Cart:** Add desired products to a shopping cart, manage quantities, and remove items.
    *   **Order Placement:** Securely place orders by providing shipping address, phone number, and choosing a payment method (Cash on Delivery or UPI). The net billed amount and product quantities are automatically handled.
    *   **Order History:** View a comprehensive history of all past orders, including their status and item details.

*   **Seller Functionalities:**
    *   **Product Catalog Management:** Add new products to the system, including details like name, description, price, and category.
    *   **Modify & Delete Products:** Update information for or remove previously listed products.
    *   **View Products:** Sellers can view all products available in the system (similar to customers) and have a dedicated view for their own listed products.
    *   **No Ordering Capability:** Sellers are restricted from placing orders within the application.

*   **Role-Based Access Control:** The system strictly enforces permissions based on user roles (Customer, Seller), ensuring users can only access functionalities relevant to their role.

The application is divided into two main parts:

*   **Backend:** A RESTful API service built with Spring Boot, handling all business logic, data storage (MySQL), and security.
*   **Frontend:** A dynamic single-page application (SPA) built with React, providing the user interface and interacting with the backend API.

## Getting Started

To run this project locally, you need to set up and run both the backend and frontend applications separately.

### 1. Backend Setup

The backend service handles the core logic, data persistence, and API endpoints.

**For detailed instructions on setting up the database (MySQL), configuring environment variables, building, running tests, and starting the backend service, please refer to the backend README:**

➡️ **[backend/README.md](./backend/README.md)**

### 2. Frontend Setup

The frontend application provides the user interface.

**For detailed instructions on installing dependencies, configuring the API connection, and starting the frontend development server, please refer to the frontend README:**

➡️ **[frontend/README.md](./frontend/README.md)**

### Running Order

Typically, you will need to start the **backend service first** before starting the frontend application, as the frontend depends on the backend API being available.

## Prerequisites

Ensure you have Git installed. Specific prerequisites for each part (JDK, Node.js, Gradle, Database) are detailed in their respective `README.md` files linked above.