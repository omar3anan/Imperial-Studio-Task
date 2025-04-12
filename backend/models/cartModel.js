const db = require('../config/db');

const Cart = {
    addToCart: (cartItem, callback) => {
        const sql = `
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `;
        db.query(sql, [cartItem.userId, cartItem.productId, cartItem.quantity, cartItem.quantity], callback);
    }
};

module.exports = Cart;