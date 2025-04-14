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
