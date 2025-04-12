# Backend README

## Overview
This backend is built using AWS Lambda functions to handle various operations for an e-commerce application. It includes user authentication, product management, shopping cart functionality, and address management.

## Setup Instructions

### Prerequisites
- AWS Account
- Node.js installed
- MySQL database setup

### AWS Setup
1. **Create an S3 Bucket**:
   - Go to the S3 service in your AWS console.
   - Create a new bucket for storing profile and product images.
   - Set appropriate permissions for public access if needed.

2. **Create IAM Role for Lambda**:
   - Go to the IAM service in your AWS console.
   - Create a new role with the following permissions:
     - `AWSLambdaBasicExecutionRole`
     - `AmazonS3FullAccess`
     - `AmazonRDSFullAccess` (or specific permissions for your MySQL database)

3. **Create MySQL Database**:
   - Set up a MySQL database instance (e.g., using Amazon RDS).
   - Create the necessary tables as defined in the `schema.sql` file.

### Deploying Lambda Functions
- Each Lambda function is located in the `lambdas` directory.
- Use the AWS console or AWS CLI to create Lambda functions for each file in the `lambdas` directory.
- Ensure to set the appropriate environment variables for database connection and JWT secret.

### Testing the API
- Use Postman to test the API endpoints.
- Import the `ecommerce-app.postman_collection.json` file located in the `postman` directory to get started with testing.

## Usage
- The backend provides endpoints for user registration, login, product retrieval, cart management, and address management.
- Refer to the individual Lambda function files for specific implementation details and endpoint configurations.

## Notes
- Ensure that the database connection details and S3 bucket name are correctly configured in your Lambda environment variables.
- Monitor the Lambda execution logs in CloudWatch for debugging and performance tracking.