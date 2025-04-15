// models/wishlistModel.js
const { getConnection } = require('../lib/db');

const Wishlist = {
    add: async (userId, productId) => {
        const connection = await getConnection();
        try {
            const [existing] = await connection.execute(
                'SELECT * FROM user_wishlist WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            if (existing.length > 0) {
                return { message: 'Product already in wishlist' };
            }
            const [result] = await connection.execute(
                'INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)',
                [userId, productId]
            );
            return result;
        } finally {
            await connection.end();
        }
    },
    getByUserId: async (userId) => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute(
                'SELECT product_id FROM user_wishlist WHERE user_id = ?',
                [userId]
            );
            return results;
        } finally {
            await connection.end();
        }
    },
    remove: async (userId, productId) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            return result;
        } finally {
            await connection.end();
        }
    }
};

module.exports = Wishlist;