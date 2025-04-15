
# 🛒 Full-Stack E-commerce Web App

A full-stack e-commerce application built using AngularJS & Node.js.  
Features user authentication, AWS S3 image uploads, and wishlist functionality.

![Badge](https://img.shields.io/badge/Frontend-AngularJS-red)
![Badge](https://img.shields.io/badge/Backend-Node.js-green)
![Badge](https://img.shields.io/badge/Database-MySQL-blue)
![Badge](https://img.shields.io/badge/Storage-AWS%20S3-yellow)
![Badge](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🔧 Tech Stack

- 🖼 **Frontend**: AngularJS  
- 🧠 **Backend**: Node.js + Express.js  
- 🗄 **Database**: MySQL  
- ☁️ **File Storage**: AWS S3  
- 🔐 **Authentication**: JWT  
- 🏗 **Architecture**: MVC  

---

## 📁 Project Structure

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

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET_KEY=your_jwt_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
```

### 4️⃣ Set Up MySQL Database

- Open **MySQL Workbench**
- Import `ecommerce_schema.sql` or your custom schema
- Update credentials in `config/db.js`

### 5️⃣ Start the Server

```bash
node index.js
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint     | Description                                    |
|--------|--------------|------------------------------------------------|
| POST   | `/register`  | Register user (supports image upload to S3)   |
| POST   | `/login`     | Login using email & password                  |

### 👤 Users

| Method | Endpoint             | Description                             |
|--------|----------------------|-----------------------------------------|
| GET    | `/users`             | Fetch all users                         |
| GET    | `/users/:id`         | Get user by ID                          |
| POST   | `/users`             | Create new user                         |
| PUT    | `/users/:id`         | Update user                             |
| DELETE | `/users/:id`         | Delete user                             |
| POST   | `/users/:id/upload`  | Upload/update profile picture (S3)      |
| GET    | `/profile`           | Get logged-in user profile + wishlist   |

### 📦 Products

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/products`      | Get all products          |
| POST   | `/products`      | Add a new product (with image) |
| DELETE | `/products/:id`  | Delete a product by ID    |

### ❤️ Wishlist

| Method | Endpoint                                         | Description                  |
|--------|--------------------------------------------------|------------------------------|
| GET    | `/wishlist/user/:userId`                         | Fetch user's wishlist        |
| POST   | `/wishlist/:productId/user/:userId`              | Add product to wishlist      |
| DELETE | `/wishlist/:productId/user/:userId`              | Remove product from wishlist |

---

## 📸 Features

✅ User Authentication using JWT  
✅ Secure Profile Picture Upload via AWS S3  
✅ Product CRUD with image management  
✅ Wishlist Add/Remove functionality  
✅ Responsive AngularJS Frontend  
✅ Fully Integrated MySQL Database  

---

## 📌 To Do

- [ ] Add AngularJS code to the repository
- [ ] Implement pagination & product filtering
- [ ] Add payment gateway (Stripe/PayPal)
- [ ] Dockerize for deployment

---

## 👨‍💻 Author

**Omar Anan Abou-Romia**

> Built with ❤️ by a passionate full-stack developer.

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute!
