# E-Commerce Project

This repository contains the source code for a full-stack E-Commerce application, designed to provide a platform for browsing and selling products online. It consists of a Spring Boot backend service and a React frontend application.

## Overview

This project implements a functional e-commerce platform allowing users to:

*   **Register and Authenticate:** Users can create accounts and log in securely using JWT-based authentication.
*   **Browse Products:** View a catalog of products, filterable by categories.
*   **View Product Details:** Access detailed information about individual products.
*   **Seller Functionality:** Users designated as 'Sellers' can add new products to the catalog via the user interface.
*   **Role-Based Access:** The system differentiates between standard customers and sellers, granting appropriate permissions for actions like product management.

The application is divided into two main parts:

*   **Backend:** A RESTful API service handling all business logic, data storage (MySQL), and security.
*   **Frontend:** A dynamic single-page application (React) providing the user interface and interacting with the backend API.

## Getting Started

To run this project locally, you need to set up and run both the backend and frontend applications separately.

### 1. Backend Setup

The backend service handles the core


## Getting Started

To run this project locally, you need to set up and run both the backend and frontend applications separately.

### 1. Backend Setup

The backend service handles the core logic, data persistence, and API endpoints.

**For detailed instructions on setting up the database (MySQL), configuring environment variables, building, running tests, and starting the backend service, please refer to the backend README:**

➡️ **[backend/README.md](./backend/README.md)**

### 2. Frontend Setup

The frontend application provides the user interface.

**For detailed instructions on installing dependencies, configuring the API connection, and starting  the frontend development server, please refer to the frontend README:**

➡️ **[frontend/README.md](./frontend/README.md)**

### Running Order

Typically, you will need to start the **backend service first** before starting the frontend application, as the frontend depends on the backend API being available.

##  Prerequisites

Ensure you have Git installed. Specific prerequisites for each part (JDK, Node.js, Gradle, Database) are detailed in their respective `README.md` files linked above.