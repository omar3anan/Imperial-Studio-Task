const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const User = require('../models/userModel');
const db = require('../config/db');
const { upload, uploadToS3 } = require('../S3');

dotenv.config();

exports.uploadProfilePicture = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    
    try {
      const fileUrl = await uploadToS3(req.file);
      // Update user profile picture in DB
      res.json({ profilePicture: fileUrl });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  });
};
exports.getProfile = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    User.findById(decoded.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Internal server error' });
      if (!results || results.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = results[0];
      res.status(200).json({
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
      });
    });
  });
};

// Update profile picture
exports.updateProfilePictureById = (req, res) => {
  const userId = req.params.id;

  if (!req.file || !req.file.location) {
    return res.status(400).json({ message: 'No profile picture uploaded.' });
  }

  const newProfilePicture = req.file.location;

  User.updateProfilePictureById(userId, newProfilePicture, (err, result) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully.',
      profilePicture: newProfilePicture,
    });
  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users.' });
    res.status(200).json(results);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user.' });
    if (!results || results.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(results[0]);
  });
};

// Create user
exports.createUser = (req, res) => {
  User.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating user.' });
    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  });
};

// Update user
exports.updateUser = (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profilePicture: req.body.profilePicture,
  };

  User.updateById(req.params.id, user, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating user.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User updated successfully.' });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  User.deleteById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting user.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deleted successfully.' });
  });
};
