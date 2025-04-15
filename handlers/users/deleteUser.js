// handlers/users/deleteUser.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const deleteUser = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = event.pathParameters;

        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted successfully.' }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(deleteUser)
    .use(httpErrorHandler());