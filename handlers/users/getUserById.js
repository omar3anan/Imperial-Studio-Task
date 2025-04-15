// handlers/users/getUserById.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const getUserById = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = event.pathParameters;

        const [results] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (!results.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(results[0]),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(getUserById)
    .use(httpErrorHandler());