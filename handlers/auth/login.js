// handlers/auth/login.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const login = async (event) => {
    let connection;
    try {
        connection = await getConnection();

        const { email, password } = event.body;
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email and password are required.' }),
            };
        }

        const [results] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (!results.length) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials.' }),
            };
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials.' }),
            };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profile_picture,
                },
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(login)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());