// handlers/products/addProduct.js
const middy = require('@middy/core');
const httpMultipartBodyParser = require('@middy/http-multipart-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const { getConnection } = require('../../lib/db');
const { uploadToS3 } = require('../../lib/s3');

const addProduct = async (event) => {
    let connection;
    try {
        connection = await getConnection();

        const { name, description, price, image } = event.body;
        if (!name || !description || !price || !image) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'All fields are required including image' }),
            };
        }

        const imageUrl = await uploadToS3(image);

        const [result] = await connection.execute(
            'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
            [name, description, price, imageUrl]
        );

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Product added successfully', productId: result.insertId }),
        };
    } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.handler = middy(addProduct)
    .use(httpMultipartBodyParser())
    .use(httpErrorHandler());