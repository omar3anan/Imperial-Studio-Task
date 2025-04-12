const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' })); // Allow requests from http://localhost:4200

// Routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});