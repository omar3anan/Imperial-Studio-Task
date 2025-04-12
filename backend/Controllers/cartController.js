const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.addToCart = (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    User.findById(userId, (err, userResults) => {
        if (err || userResults.length === 0) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Check if product exists
        Product.findById(productId, (err, productResults) => {
            if (err || productResults.length === 0) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            // Add to cart
            const cartItem = { userId, productId, quantity };
            Cart.addToCart(cartItem, (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                res.status(200).json({ message: 'Product added to cart', results });
            });
        });
    });
};