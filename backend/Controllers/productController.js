const Product = require('../models/productModel');
const { uploadToS3 } = require('../S3');

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
    const { name, description, price } = req.body;
  
    if (!name || !description || !price || !req.file) {
      return res.status(400).json({ message: 'All fields are required including image' });
    }
  
    uploadToS3(req.file)
      .then((imageUrl) => {
        const product = { name, description, price, imageUrl };
  
        Product.create(product, (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
          }
  
          res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
        });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
      });
  };

  exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    Product.deleteById(id, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    });
};