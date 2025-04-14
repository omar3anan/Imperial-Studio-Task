const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = 'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)';
    db.query(sql, [user.name, user.email, user.password, user.profilePicture], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  },

  findById: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  },

  // New function to get user data along with wishlist
  findByIdWithWishlist: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) return callback(null, []);

      // Get the first (and only) user result
      const user = results[0];

      // Query the wishlist table for product IDs linked to this user
      const wishlistSql = 'SELECT product_id FROM user_wishlist WHERE user_id = ?';
      db.query(wishlistSql, [id], (err, wishlistResults) => {
        if (err) return callback(err);
        // Map the results to an array of product IDs
        user.wishlist = wishlistResults.map(item => item.product_id);
        callback(null, [user]);
      });
    });
  },

  findAll: (callback) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, callback);
  },

  updateById: (id, user, callback) => {
    const sql = 'UPDATE users SET name = ?, email = ?, password = ?, profile_picture = ? WHERE id = ?';
    db.query(sql, [user.name, user.email, user.password, user.profilePicture, id], callback);
  },

  updateProfilePictureById: (id, profilePicture, callback) => {
    const sql = 'UPDATE users SET profile_picture = ? WHERE id = ?';
    db.query(sql, [profilePicture, id], callback);
  },

  deleteById: (id, callback) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = User;
