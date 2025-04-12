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
    }
};

module.exports = User;