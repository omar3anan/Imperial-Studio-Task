// models/productModel.js
const { getConnection } = require('../lib/db');

const Product = {
    getAll: async () => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM products');
            return results;
        } finally {
            await connection.end();
        }
    },
    create: async (product) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
                [product.name, product.description, product.price, product.imageUrl]
            );
            return result;
        } finally {
            await connection.end();
        }
    },
    findById: async (id) => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
            return results;
        } finally {
            await connection.end();
        }
    },
    deleteById: async (id) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);
            return result;
        } finally {
            await connection.end();
        }
    }
};

module.exports = Product;