// handlers/users/createUser.js
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const createUser = async (event) => {
    let connection;
    try {
        connection = await getConnection();
        const user = event.body;

        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
            [user.name, user.email, user.password, user.profile_picture || null]
        );

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully.', userId: result.insertId }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(createUser)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());