# eCommerce Application

## Overview
This project is an eCommerce application built using Angular for the frontend and AWS Lambda with Node.js for the backend. It allows users to register, log in, browse products, manage a shopping cart, and handle multiple addresses.

## Features
- User authentication with JWT
- User profile management with profile picture upload to S3
- Product listing with images stored in S3
- Shopping cart functionality
- Multiple address management for users

## Project Structure
```
ecommerce-app
├── backend               # Backend code (AWS Lambda)
│   ├── lambdas          # Lambda functions
│   ├── package.json     # Backend dependencies
│   └── README.md        # Backend documentation
├── frontend              # Frontend code (Angular)
│   ├── src              # Source files
│   ├── angular.json     # Angular configuration
│   ├── package.json     # Frontend dependencies
│   └── README.md        # Frontend documentation
├── database              # Database schema
│   ├── schema.sql       # MySQL schema
│   └── README.md        # Database documentation
├── postman               # Postman collection for API testing
│   └── ecommerce-app.postman_collection.json
└── README.md            # Overall project documentation
```

## Getting Started

### Prerequisites
- Node.js
- MySQL
- AWS account with S3 and Lambda services

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure AWS credentials for Lambda and S3 access.
4. Deploy Lambda functions using the AWS Management Console.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Run the Angular application:
   ```
   ng serve
   ```

### Database Setup
1. Use the `schema.sql` file in the `database` directory to create the MySQL database structure.
2. Ensure that the database connection details are correctly configured in the backend code.

### AWS Setup Steps
1. Create an S3 bucket for storing profile and product images.
2. Set up IAM roles and policies to allow Lambda functions to access S3 and RDS (if using MySQL on RDS).
3. Configure environment variables for Lambda functions as needed.

## API Testing
A Postman collection is provided in the `postman` directory to test the API endpoints. Import the `ecommerce-app.postman_collection.json` file into Postman to get started.

## License
This project is licensed under the MIT License.