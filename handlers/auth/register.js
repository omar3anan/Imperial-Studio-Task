// handlers/auth/register.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToS3 } = require('../../lib/s3');
const middy = require('@middy/core');
const httpMultipartBodyParser = require('@middy/http-multipart-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');

const register = async (event) => {
    let connection;
    try {
        connection = await getConnection();

        const { name, email, password, profilePicture } = event.body;
        if (!name || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Name, email, and password are required.' }),
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = { name, email, password: hashedPassword };

        if (profilePicture) {
            const imageUrl = await uploadToS3(profilePicture);
            user.profilePicture = imageUrl;
        }

        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
            [user.name, user.email, user.password, user.profilePicture || null]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User registered successfully',
                token,
                user: {
                    id: result.insertId,
                    name,
                    email,
                    profilePicture: user.profilePicture || null,
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

module.exports.handler = middy(register)
    .use(httpMultipartBodyParser())
    .use(httpErrorHandler());