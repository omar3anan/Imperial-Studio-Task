// models/Wishlist.js
const db = require('../config/db');

const Wishlist = {
  add: (userId, productId, callback) => {
    // First, check if the record already exists.
    const checkSql = 'SELECT * FROM user_wishlist WHERE user_id = ? AND product_id = ?';
    db.query(checkSql, [userId, productId], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) {
        return callback(null, { message: 'Product already in wishlist' });
      }
      
      // If no duplicate is found, insert the new record.
      const sql = 'INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)';
      db.query(sql, [userId, productId], callback);
    });
  },

  getByUserId: (userId, callback) => {
    const sql = 'SELECT product_id FROM user_wishlist WHERE user_id = ?';
    db.query(sql, [userId], callback);
  },

  // NEW: Remove method
  remove: (userId, productId, callback) => {
    const sql = 'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], callback);
  }
};

module.exports = Wishlist;
