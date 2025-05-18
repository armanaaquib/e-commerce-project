# E-Commerce Project - Backend Service

This is the backend service for the E-Commerce Project, built using Spring Boot and Gradle. It handles user authentication, product management, category management, and other core e-commerce functionalities, primarily interacting with a MySQL database.

## Overview

The service provides RESTful APIs for:

*   **Authentication & Authorization:**
    *   User registration (Customer or Seller roles).
    *   User login using JWT (JSON Web Tokens) for secure session management.
    *   Role-based access control to protect endpoints based on user roles (Customer, Seller).
*   **User Profile Management:**
    *   Fetching the authenticated user's profile details.
    *   Updating the authenticated user's personal information.
*   **Product Categories:**
    *   Listing all available product categories.
*   **Product Management:**
    *   Listing products, filterable by category (for all users).
    *   Adding new products (for authenticated Sellers).
    *   Updating existing products (for authenticated Sellers who own the product).
    *   Deleting products (for authenticated Sellers who own the product).
    *   Listing products added by the authenticated Seller.
*   **Shopping Cart Management (for Customers):**
    *   Fetching the customer's current shopping cart.
    *   Adding items to the cart.
    *   Updating the quantity of items in the cart.
    *   Removing items from the cart.
*   **Order Management (for Customers):**
    *   Placing new orders from the items in the cart, including shipping details and payment method (Cash on Delivery or UPI).

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Java Development Kit (JDK):** Version 17 or later.
*   **Gradle:** Version 7.0 or later (The project includes a Gradle Wrapper, so direct installation might not be necessary if you use `./gradlew` or `gradlew.bat`).
*   **Database:** A running instance of **MySQL**. The connection details need to be configured via environment variables.

## Configuration (Environment Variables)

This application uses environment variables for sensitive configuration like database credentials and JWT secrets. You **must** configure these variables in the environment where you run the application.

The application reads the following environment variables (typically configured to override values in `src/main/resources/application.properties`):

1.  **`DATABASE_URL`**: The full JDBC URL for your **MySQL** database connection.
    *   *Example:* `jdbc:mysql://localhost:3306/ecommerce_db`

2.  **`DATABASE_USERNAME`**: The username for connecting to your MySQL database.
    *   *Example:* `ecommerce_user` or `root` (not recommended for production).

3.  **`DATABASE_PASSWORD`**: The password for the specified database user.
    *   *Example:* `your_secure_password`

4.  **`JWT_SECRET_KEY`**: A strong, secret key used for signing and verifying JSON Web Tokens. **This should be kept confidential and be sufficiently long and random.**
    *   *Example:* `5367566859703373367639792F423F452848284D6251655468576D5A71347437`

**How to Set Environment Variables:**

The method depends on your operating system and how you run the application:

**Linux/macOS (Terminal):**
`export DATABASE_URL="jdbc:mysql://localhost:3306/ecommerce_db" export DATABASE_USERNAME="your_db_user" export DATABASE_PASSWORD="your_db_password" export JWT_SECRET_KEY="your_jwt_secret"`

**Windows (Command Prompt):**
`$env:DATABASE_URL = "jdbc:mysql://localhost:3306/ecommerce_db" $env:DATABASE_USERNAME = "your_db_user" $env:DATABASE_PASSWORD = "your_db_password" $env:JWT_SECRET_KEY = "your_jwt_secret"`

> Note: You can add these values directly in the application.properties file temporarily for local development and testing, but this is not recommended for production or shared environment

## Running the Application

1.  **Ensure Prerequisites are met.**
2.  **Set up the required Environment Variables** (see Configuration section). Make sure your **MySQL** server is running and the specified database exists (the application uses spring.jpa.hibernate.ddl-auto=update which can create/update tables, but the database itself should exist).
3.  **Navigate to the project's root directory** (where `build.gradle` and `gradlew` are located).
4.  **Run the application using the Gradle Wrapper:**

**On Linux/macOS:**
`./gradlew bootRun`

**On Windows:**
`./gradlew.bat bootRun`

## Running Tests

The project includes unit and integration tests. The tests are configured to use an in-memory H2 database by default (via `src/test/resources/application-test.properties`), so they **do not** require the external MySQL database configured for the main application to be running.

1.  **Navigate to the project's root directory.**
2.  **Run the tests using the Gradle Wrapper:**

**On Linux/macOS:**
`./gradlew test`

**On Windows:**
`./gradlew.bat test`


## API Endpoints (Examples)

*   **Authentication:**
    *   `POST /api/auth/register`: Register a new user (Customer or Seller).
    *   `POST /api/auth/login`: Log in an existing user and receive a JWT.
*   **User Profile:**
    *   `GET /api/users/profile`: Get the authenticated user's profile.
    *   `PUT /api/users/profile`: Update the authenticated user's profile.
*   **Product Categories:**
    *   `GET /api/product-categories`: Get a list of all product categories.
*   **Products:**
    *   `GET /api/products/category/{categoryId}`: Get products belonging to a specific category.
    *   `POST /api/products`: Add a new product (Requires Seller role).
    *   `PUT /api/products/{productId}`: Update an existing product (Requires Seller role, owner).
    *   `DELETE /api/products/{productId}`: Delete a product (Requires Seller role, owner).
    *   `GET /api/products/my-products`: Get products listed by the authenticated Seller.
*   **Cart (Customer Role):**
    *   `GET /api/cart`: Get the customer's current cart.
    *   `POST /api/cart/items`: Add an item to the cart.
    *   `PUT /api/cart/items/{cartItemId}`: Update an item's quantity in the cart.
    *   `DELETE /api/cart/items/{cartItemId}`: Remove an item from the cart.
*   **Orders (Customer Role):**
    *   `POST /api/orders`: Place a new order.
    *   `GET /api/orders`: Get the customer's order history.

## Technologies Used
*   Java 17+
*   Spring Boot
*   Spring Security (with JWT Authentication)
*   Spring Data JPA (with Hibernate)
*   Spring Validation
*   **Gradle** (Build Tool)
*   **MySQL** (Primary Database)
*   H2 Database (for testing)
