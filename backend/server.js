const express = require('express');
const multer = require('multer'); // Import multer for file handling
const cors = require('cors'); // Import the cors package

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(express.json()); // Built-in Express JSON parser
app.use(cors({ origin: 'http://localhost:4200' })); // Allow requests from http://localhost:4200

// Set up multer for file upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Give the uploaded file a unique name
  }
});

const upload = multer({ storage }); // Initialize multer with the defined storage settings

// Routes
app.use('/auth', upload.single('profilePicture'), authRoutes); // Use multer for single file upload on auth routes
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
