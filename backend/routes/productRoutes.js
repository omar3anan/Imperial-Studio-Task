const express = require('express');
const productController = require('../Controllers/productController');
const router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Add a new product
router.post('/', productController.addProduct);

module.exports = router;