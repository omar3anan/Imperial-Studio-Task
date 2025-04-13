const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize AWS S3 with your credentials and region from environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer setup to upload images to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME, // Ensure this is correctly loaded from environment variables
    acl: 'public-read', // Make uploaded files publicly accessible
    key: function (req, file, cb) {
      // Generate a unique filename using the current timestamp and file extension
      cb(null, Date.now().toString() + path.extname(file.originalname)); // Ensure the name is unique
    },
  }),
});

// Register endpoint to create a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided and a file is uploaded
  if (!name || !email || !password || !req.file) {
    return res.status(400).json({ message: 'All fields are required, including profile picture' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password for security
    const profilePicture = req.file.location;  // URL of the uploaded profile picture on S3

    // Create the user object
    const user = { name, email, password: hashedPassword, profilePicture };

    // Save the user to the database
    User.create(user, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      // Respond with success, token, name, email, and profile picture URL
      res.status(201).json({
        message: 'User registered successfully',
        token,
        name,
        email,
        profilePicture,
      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Login endpoint to authenticate user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find the user by email
  User.findByEmail(email, async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // If no user found, return invalid credentials
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token upon successful login
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Respond with success, token, name, email, and profile picture URL
    res.status(200).json({
      message: 'Login successful',
      token,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
    });
  });
};

// Route to handle profile picture upload (for example, on profile update)
exports.uploadProfilePicture = upload.single('profilePicture');  // 'profilePicture' is the field name in the form

// Profile route to fetch the user's data (protected route)
exports.profile = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from 'Authorization: Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    User.findById(user.id, (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userProfile = results[0];
      res.status(200).json({
        name: userProfile.name,
        email: userProfile.email,
        profilePicture: userProfile.profile_picture,
      });
    });
  });
};
