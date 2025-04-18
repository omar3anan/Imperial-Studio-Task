const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Reusable multer middleware
const getUploadMiddleware = (fieldName) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).single(fieldName); // <-- fieldName passed dynamically

const uploadToS3 = async (file) => {
  try {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: Date.now().toString() + path.extname(file.originalname),
      Body: file.buffer,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('File upload failed');
  }
};

module.exports = { getUploadMiddleware, uploadToS3 };
