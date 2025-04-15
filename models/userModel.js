// models/userModel.js
const { getConnection } = require('../lib/db');

const User = {
    create: async (user) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
                [user.name, user.email, user.password, user.profilePicture || null]
            );
            return result;
        } finally {
            await connection.end();
        }
    },
    findByEmail: async (email) => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            return results;
        } finally {
            await connection.end();
        }
    },
    findById: async (id) => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
            return results;
        } finally {
            await connection.end();
        }
    },
    findByIdWithWishlist: async (id) => {
        const connection = await getConnection();
        try {
            const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
            if (!users.length) return [];

            const [wishlist] = await connection.execute(
                'SELECT product_id FROM user_wishlist WHERE user_id = ?',
                [id]
            );
            users[0].wishlist = wishlist.map(item => item.product_id);
            return users;
        } finally {
            await connection.end();
        }
    },
    findAll: async () => {
        const connection = await getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM users');
            return results;
        } finally {
            await connection.end();
        }
    },
    updateById: async (id, user) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE users SET name = ?, email = ?, password = ?, profile_picture = ? WHERE id = ?',
                [user.name, user.email, user.password, user.profilePicture, id]
            );
            return result;
        } finally {
            await connection.end();
        }
    },
    updateProfilePictureById: async (id, profilePicture) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE users SET profile_picture = ? WHERE id = ?',
                [profilePicture, id]
            );
            return result;
        } finally {
            await connection.end();
        }
    },
    deleteById: async (id) => {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
            return result;
        } finally {
            await connection.end();
        }
    }
};

module.exports = User;