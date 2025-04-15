// handlers/users/uploadProfilePicture.js
const middy = require('@middy/core');
const httpMultipartBodyParser = require('@middy/http-multipart-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');
const { uploadToS3 } = require('../../lib/s3');

const uploadProfilePicture = async (event) => {
    let connection;
    try {
        connection = await getConnection();

        const { id } = event.pathParameters;
        const { profilePicture } = event.body;
        if (!profilePicture) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Profile picture is required' }),
            };
        }

        const fileUrl = await uploadToS3(profilePicture);

        const [result] = await connection.execute(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [fileUrl, id]
        );
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Upload successful',
                profilePicture: fileUrl,
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(uploadProfilePicture)
    .use(httpMultipartBodyParser())
    .use(httpErrorHandler());