# Serverless Ecommerce Application

This project is a serverless ecommerce application built with AWS Lambda and API Gateway, designed to handle user authentication, product management, user profiles, and wishlists. The backend is implemented in Node.js, initially tested with a local MySQL database, and intended for production with AWS RDS. The deployment was performed natively using the AWS Management Console, without frameworks like Serverless Framework.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Lambda Functions](#lambda-functions)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Local Testing](#local-testing)
- [Scripts](#scripts)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

## Features
- User registration and login with JWT authentication.
- Product listing, creation, and deletion.
- User profile management, including profile picture uploads to S3.
- Wishlist functionality to add, view, and remove products.
- RESTful API exposed via API Gateway.
- Local MySQL database for development, with plans for AWS RDS in production.

## Architecture
The application follows a serverless architecture:
- **AWS Lambda**: Hosts individual functions for each endpoint logic.
- **API Gateway**: Provides a RESTful interface to trigger Lambda functions.
- **MySQL Database**: Locally hosted for testing (`localhost`), with a transition to AWS RDS for cloud deployment.
- **AWS S3**: Stores profile pictures and product images.
- **Node.js**: Backend runtime with dependencies like `mysql2`, `jsonwebtoken`, and `@aws-sdk/client-s3`.

## Lambda Functions
The backend consists of 15 Lambda functions, each handling a specific operation. Below is a summary:

| Function Name                | Description                                           |
|------------------------------|-------------------------------------------------------|
| `ecommerce-register`         | Registers a new user with name, email, and password.  |
| `ecommerce-login`            | Authenticates users and returns a JWT token.          |
| `ecommerce-getProducts`      | Retrieves all products from the database.             |
| `ecommerce-addProduct`       | Adds a new product with details and image upload.     |
| `ecommerce-deleteProduct`    | Deletes a product by ID.                              |
| `ecommerce-getProfile`       | Fetches the authenticated user's profile.             |
| `ecommerce-uploadProfilePicture` | Uploads a user's profile picture to S3.            |
| `ecommerce-getAllUsers`      | Lists all users (admin only).                        |
| `ecommerce-getUserById`      | Retrieves a user by ID.                              |
| `ecommerce-createUser`       | Creates a new user (admin only).                     |
| `ecommerce-updateUser`       | Updates user details by ID.                          |
| `ecommerce-deleteUser`       | Deletes a user by ID.                                |
| `ecommerce-addToWishlist`    | Adds a product to a user's wishlist.                 |
| `ecommerce-getUserWishlist`  | Retrieves a user's wishlist.                         |
| `ecommerce-removeFromWishlist` | Removes a product from a user's wishlist.           |

Each function is packaged with `lib/` (database and S3 utilities), `models/` (data schemas), and `node_modules/`, deployed as a ZIP file via the AWS Console.

## API Endpoints
The API Gateway exposes the following endpoints under the base URL `https://<api-id>.execute-api.eu-north-1.amazonaws.com/dev`:

| Endpoint                              | Method | Lambda Function                | Description                                     |
|---------------------------------------|--------|--------------------------------|-------------------------------------------------|
| `/auth/register`                      | POST   | `ecommerce-register`           | Register a new user.                           |
| `/auth/login`                         | POST   | `ecommerce-login`             | Log in and get JWT token.                      |
| `/products`                           | GET    | `ecommerce-getProducts`       | List all products.                             |
| `/products`                           | POST   | `ecommerce-addProduct`        | Add a new product (multipart/form-data).       |
| `/products/{id}`                      | DELETE | `ecommerce-deleteProduct`     | Delete a product.                              |
| `/users/profile`                      | GET    | `ecommerce-getProfile`        | Get user profile.                              |
| `/users/profile-picture/{id}`         | POST   | `ecommerce-uploadProfilePicture` | Upload profile picture.                     |
| `/users`                              | GET    | `ecommerce-getAllUsers`       | List all users.                                |
| `/users/{id}`                         | GET    | `ecommerce-getUserById`       | Get user by ID.                                |
| `/users`                              | POST   | `ecommerce-createUser`        | Create a new user.                             |
| `/users/{id}`                         | PUT    | `ecommerce-updateUser`        | Update user details.                           |
| `/users/{id}`                         | DELETE | `ecommerce-deleteUser`        | Delete a user.                                 |
| `/wishlist/{productId}/user/{userId}` | POST   | `ecommerce-addToWishlist`     | Add product to wishlist.                       |
| `/wishlist/user/{userId}`             | GET    | `ecommerce-getUserWishlist`   | Get user's wishlist.                           |
| `/wishlist/{productId}/user/{userId}` | DELETE | `ecommerce-removeFromWishlist` | Remove product from wishlist.                 |

CORS is enabled for all endpoints to support frontend integration.

## Database Setup
- **Local Testing**: Used a local MySQL database (`localhost:3306`, database: `ecommerce`, user: `root`, password: `root`) for development.
- **Cloud Plan**: Configured for migration to AWS RDS (`ecommerce-db.eu-north-1.rds.amazonaws.com`) for production to ensure accessibility from Lambda.
- **Schema**: Includes tables for `users`, `products`, and `wishlist`, managed via `models/` scripts.

## Deployment
The application was deployed using the AWS Management Console:
1. **IAM Role**: Created `LambdaEcommerceRole` with `AWSLambdaBasicExecutionRole` and `AmazonS3FullAccess` policies.
2. **Packaging**: Used a PowerShell script (`package.ps1`) to bundle each Lambda function with dependencies into ZIP files, addressing Windows file-locking issues with retries.
3. **Lambda**: Uploaded 15 ZIP files to Lambda functions in `eu-north-1`, configured with environment variables:
   - `DB_HOST`: Initially `localhost` (testing), planned for RDS endpoint.
   - `DB_USER`: `root`
   - `DB_PASSWORD`: `root`
   - `DB_NAME`: `ecommerce`
   - `JWT_SECRET_KEY`: `abouromia`
   - `AWS_REGION`: `eu-north-1`
   - `S3_BUCKET_NAME`: `upload-profile-picture`
4. **API Gateway**: Set up a REST API (`EcommerceAPI`) with resources and methods linked to Lambda functions, deployed to the `dev` stage.
5. **S3**: Used bucket `upload-profile-picture` for image storage.

**Note**: Connecting Lambda to a local MySQL database requires exposing MySQL publicly, which is insecure. RDS is recommended for production.

## Local Testing
- **Backend**: Tested handlers locally using Node.js scripts (e.g., `test-register.js`) with `dotenv` to load environment variables, connecting to local MySQL.
- **API Simulation**: Used an `express` server (`local-server.js`) to mock API Gateway endpoints at `http://localhost:3000`.
- **Frontend**: Planned integration with an AngularJS frontend, fetching data from API Gateway.

## Scripts
- **Packaging**: `package.ps1` creates ZIP files for each Lambda function, handling file-locking issues on Windows with retry logic.
- **Listing Lambdas**: `list-lambdas.ps1` retrieves all Lambda functions in `eu-north-1`, displaying details like name, ARN, and runtime.

To run the listing script:
```powershell
.\list-lambdas.ps1
```

**Output Example**:
```
Fetching Lambda functions in eu-north-1...
Found 15 Lambda functions:

Function Name: ecommerce-register
ARN: arn:aws:lambda:eu-north-1:123456789012:function:ecommerce-register
Runtime: nodejs20.x
Role: arn:aws:iam::123456789012:role/LambdaEcommerceRole
Description:
Last Modified: 2025-04-15T12:34:56.789+0000
-----------------------------------
...
```

**Requirements**:
- AWS CLI installed and configured (`aws configure` with credentials).
- Run in PowerShell from the project root.

## Security Considerations
- **Local MySQL**: Exposed publicly for testing (`bind-address=0.0.0.0`, port 3306), posing security risks. Plan to secure or replace with RDS.
- **Credentials**: AWS keys and database password stored in environment variables. Recommended migrating to AWS Secrets Manager.
- **IAM Role**: Scoped to minimal permissions; consider adding `secretsmanager:GetSecretValue` for production.
- **S3**: Ensure `upload-profile-picture` has restricted access (e.g., bucket policy).

## Future Improvements
- Migrate database to AWS RDS for reliability and security.
- Implement AWS Secrets Manager for sensitive data.
- Deploy AngularJS frontend to S3/CloudFront.
- Add input validation and rate limiting in API Gateway.
- Enhance error handling and logging in Lambda functions.
