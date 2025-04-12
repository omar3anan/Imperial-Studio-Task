# Database Setup and Structure

This document provides an overview of the database setup and structure for the ecommerce application.

## Database Management System

The application uses MySQL as the relational database management system.

## Database Schema

The database schema is defined in the `schema.sql` file located in the `database` directory. This schema includes the following tables:

1. **Users**
   - Stores user information such as name, email, password (hashed), and profile picture URL.

2. **Products**
   - Contains product details including name, description, price, and image URL.

3. **Cart**
   - Links users to their shopping cart items, allowing for the addition and removal of products.

4. **Addresses**
   - Supports multiple addresses for each user, allowing users to manage their shipping information.

## Setup Instructions

1. **Create Database**
   - Use the SQL commands in `schema.sql` to create the necessary tables in your MySQL database.

2. **Database Connection**
   - Ensure that your backend Lambda functions are configured to connect to the MySQL database using appropriate credentials.

3. **Testing**
   - After setting up the database, you can test the API endpoints to ensure that data is being correctly stored and retrieved.

## Additional Information

For further details on the API endpoints and their usage, refer to the backend `README.md` file.