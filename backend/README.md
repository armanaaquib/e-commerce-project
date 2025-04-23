# E-Commerce Project - Backend Service

This is the backend service for the E-Commerce Project, built using Spring Boot and Gradle. It handles user authentication, product management, category management, and other core e-commerce functionalities, primarily interacting with a MySQL database.

## Overview

The service provides RESTful APIs for:

*   **Authentication:** User registration and login using JWT (JSON Web Tokens).
*   **Product Categories:** Listing available product categories.
*   **Products:** Listing products (potentially filtered by category), adding new products (for authorized sellers).
*   **Authorization:** Role-based access control (e.g., differentiating between Customers and Sellers).

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Java Development Kit (JDK):** Version 17 or later.
*   **Gradle:** Version 7.0 or later (The project includes a Gradle Wrapper
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

> You can add these value directly in application.properties file temporarily as well for running locally and testing the application.

## Running the Application

1.  **Ensure Prerequisites are met.**
2.  **Set up the required Environment Variables** (see Configuration section). Make sure your **MySQL** server is running and the specified database exists.
3.  **Navigate to the project's root directory** (where `build.gradle` and `gradlew` are located).
4.  **Run the application using the Gradle Wrapper:**

**On Linux/macOS:**
`./gradlew bootRun`

**On Windows:**
`./gradlew bootRun`

## Running Tests

The project includes unit and integration tests. The tests are configured to use an in-memory H2 database by default (via `src/test/resources/application-test.properties`), so they **do not** require the external MySQL database configured for the main application to be running.

1.  **Navigate to the project's root directory.**
2.  **Run the tests using the Gradle Wrapper:**

**On Linux/macOS:**
`./gradlew test`

**On Windows:**
`./gradlew test`

## API Endpoints (Examples)
*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in an existing user and receive a JWT.
*   `GET /api/product-categories`: Get a list of all product categories.
*   `GET /api/products/category/{categoryId}`: Get products belonging to a specific category.
*   `POST /api/products`: Add a new product (Requires Seller role and valid JWT).

## Technologies Used
*   Java 17+
*   Spring Boot
*   Spring Security (with JWT Authentication)
*   Spring Data JPA
*   **Gradle** (Build Tool)
*   **MySQL** (Primary Database)
*   H2 Database (for testing)
