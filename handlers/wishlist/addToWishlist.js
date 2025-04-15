// handlers/wishlist/addToWishlist.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const addToWishlist = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const { productId, userId } = event.pathParameters;

        const [existing] = await connection.execute(
            'SELECT * FROM user_wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        if (existing.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Product already in wishlist' }),
            };
        }

        const [result] = await connection.execute(
            'INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Product added to wishlist successfully',
                wishlist_entry: result,
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(addToWishlist)
    .use(httpErrorHandler());