# 🛒 Full-Stack E-commerce Web App

A full-stack e-commerce web application built with **AngularJS (frontend)** and **Node.js + Express.js (backend)** using the **MVC architecture**. The app supports user registration with profile picture upload (via AWS S3), login, product listing & management, and wishlist functionality.

---

## 🧰 Tech Stack

- **Frontend**: AngularJS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Storage**: AWS S3
- **Authentication**: JWT
- **Architecture**: MVC

---

## 📂 Project Structure

```bash
.
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── userController.js
│   └── wishlistController.js
├── models/
│   ├── productModel.js
│   ├── userModel.js
│   └── wishlistModel.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── wishlistRoutes.js
├── S3.js
├── index.js
└── .env
```
🚀 Getting Started
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install Dependencies
Backend (Node.js)
bash
Copy code
cd backend
npm install
Frontend (AngularJS)
bash
Copy code
cd frontend
npm install
3. Set Up Environment Variables
Create a .env file in the root directory:

env
Copy code
JWT_SECRET_KEY=your_jwt_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
4. Set Up MySQL Database
Open MySQL Workbench.

Import the provided SQL schema file (e.g., ecommerce_schema.sql) into your MySQL server.

Update the credentials in config/db.js if needed.

5. Start the Server
bash
Copy code
node index.js
📡 API Endpoints
🔐 Auth

Method	Endpoint	Description
POST	/register	Register a new user with optional profile picture upload
POST	/login	Login with email and password
👤 Users

Method	Endpoint	Description
GET	/users	Get all users
GET	/users/:id	Get user by ID
POST	/users	Create a new user
PUT	/users/:id	Update user info
DELETE	/users/:id	Delete a user
POST	/users/:id/upload	Upload/update profile picture
GET	/profile	Get logged-in user profile + wishlist (requires token)
📦 Products

Method	Endpoint	Description
GET	/products	Get all products
POST	/products	Add a new product (image required)
DELETE	/products/:id	Delete product by ID
❤️ Wishlist

Method	Endpoint	Description
GET	/wishlist/user/:userId	Get user's wishlist
POST	/wishlist/:productId/user/:userId	Add product to wishlist
DELETE	/wishlist/:productId/user/:userId	Remove product from wishlist
📸 Features
✅ User Authentication (JWT)

✅ Profile Picture Upload (AWS S3)

✅ Product CRUD Operations

✅ Wishlist Add/Remove

✅ AngularJS Dynamic UI

✅ MySQL Schema Included

📌 To Do
 Add frontend AngularJS code to repository (if not included yet)

 Add pagination/search for products

 Dockerize the app

 Add Stripe/PayPal for payments

🧑‍💻 Author
Omar Anan Abou-Romia

📜 License
This project is licensed under the MIT License.

