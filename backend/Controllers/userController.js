const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
// Ensure this import points to the correct path where your S3 module is located
const { getUploadMiddleware, uploadToS3 } = require('../S3');


dotenv.config();

// Upload Profile Picture to S3 and Save in DB
exports.uploadProfilePicture = (req, res) => {
  // Use getUploadMiddleware with the correct field name (e.g., 'profilePicture')
  const uploadMiddleware = getUploadMiddleware('profilePicture');

  // Use the middleware in the request handler
  uploadMiddleware(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const fileUrl = await uploadToS3(req.file);  // Upload to S3
      const userId = req.params.id;  // User ID from the URL parameter

      // Update user profile with the new picture URL
      User.updateProfilePictureById(userId, fileUrl, (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update DB' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({
          message: 'Upload successful',
          profilePicture: fileUrl,
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  });
};

// Get Profile Info with Wishlist (called when loading frontend)
exports.getProfile = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    // Use the new findByIdWithWishlist to include wishlist data
    User.findByIdWithWishlist(decoded.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Internal server error' });
      if (!results || results.length === 0) return res.status(404).json({ message: 'User not found' });
    
      const user = results[0];
      res.status(200).json({
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
        wishlist: user.wishlist // This will be an array of product IDs
      });
    });
  });
};

// CRUD Operations
exports.getAllUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users.' });
    res.status(200).json(results);
  });
};

exports.getUserById = (req, res) => {
  // You could switch to using findByIdWithWishlist if you also want wishlist info here.
  User.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user.' });
    if (!results || results.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(results[0]);
  });
};

exports.createUser = (req, res) => {
  User.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating user.' });
    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  });
};

exports.updateUser = (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profile_picture: req.body.profile_picture,
  };

  User.updateById(req.params.id, user, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating user.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User updated successfully.' });
  });
};

exports.deleteUser = (req, res) => {
  User.deleteById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting user.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deleted successfully.' });
  });
};
