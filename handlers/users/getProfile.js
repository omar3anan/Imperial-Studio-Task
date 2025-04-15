// handlers/users/getProfile.js
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const getProfile = async (event) => {
    let connection;
    try {
        connection = await getConnection();

        const token = event.headers.Authorization?.split(' ')[1];
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Access denied. No token provided.' }),
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
        if (!users.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        const user = users[0];
        const [wishlist] = await connection.execute(
            'SELECT product_id FROM user_wishlist WHERE user_id = ?',
            [decoded.id]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                profile_picture: user.profile_picture,
                wishlist: wishlist.map(item => item.product_id),
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(getProfile)
    .use(httpErrorHandler());