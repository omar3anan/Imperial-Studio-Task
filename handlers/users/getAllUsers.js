// handlers/users/getAllUsers.js
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const getAllUsers = async () => {
    let connection;
    try {
        connection = await getConnection();
        const [results] = await connection.execute('SELECT * FROM users');
        return {
            statusCode: 200,
            body: JSON.stringify(results),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(getAllUsers)
    .use(httpErrorHandler());