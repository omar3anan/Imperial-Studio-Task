const express = require('express');
const productController = require('../Controllers/productController');
const router = express.Router();
const { getUploadMiddleware } = require('../S3');

// Get all products
router.get('/', productController.getProducts);

// Add a new product

router.post('/', getUploadMiddleware('image'), productController.addProduct);

router.delete('/:id', productController.deleteProduct); // 👈 Add this line

module.exports = router;