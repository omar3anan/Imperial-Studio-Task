// handlers/wishlist/getUserWishlist.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const getUserWishlist = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const { userId } = event.pathParameters;

        const [results] = await connection.execute(
            'SELECT product_id FROM user_wishlist WHERE user_id = ?',
            [userId]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ wishlist: results.map(entry => entry.product_id) }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(getUserWishlist)
    .use(httpErrorHandler());