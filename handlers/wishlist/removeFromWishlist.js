// handlers/wishlist/removeFromWishlist.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const removeFromWishlist = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const { productId, userId } = event.pathParameters;

        const [result] = await connection.execute(
            'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Wishlist entry not found.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Product removed from wishlist successfully' }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(removeFromWishlist)
    .use(httpErrorHandler());