// models/productModel.js
const db = require('../config/db');

const Product = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM products';
        db.query(sql, callback);
    },
    create: (product, callback) => {
        const sql = 'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)';
        const values = [product.name, product.description, product.price, product.imageUrl];
        db.query(sql, values, callback);
    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM products WHERE id = ?';
        db.query(sql, [id], callback);
    },
    deleteById: (id, callback) => {
        const sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Product;
