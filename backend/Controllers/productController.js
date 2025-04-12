const Product = require('../models/productModel');

// Get all products
exports.getProducts = (req, res) => {
    Product.getAll((err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.status(200).json(results);
    });
};

// Add a new product
exports.addProduct = (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const product = { name, description, price, imageUrl };

    Product.create(product, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    });
};