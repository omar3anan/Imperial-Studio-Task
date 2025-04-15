const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { uploadToS3, getUploadMiddleware } = require('../S3');

/**
 * Register a new user.
 * Accepts: name, email, password.
 */
const uploadProfilePicture = getUploadMiddleware('profilePicture');

exports.register = (req, res) => {
  // Handle file upload using the multer middleware
  uploadProfilePicture(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { name, email, password: hashedPassword };

      // If a file (profile picture) was uploaded, handle it
      if (req.file) {
        try {
          // Upload the image to S3
          const imageUrl = await uploadToS3(req.file);
          user.profilePicture = imageUrl; // Add the image URL to the user object
        } catch (error) {
          return res.status(500).json({ message: 'Image upload failed', error: error.message });
        }
      }

      // Save the user to the database
      User.create(user, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Return full user data including profile picture URL if uploaded
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: results.insertId,
            name,
            email,
            profilePicture: user.profilePicture || null, // If no picture, send null or a default image URL
          },
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}
/**
 * Login an existing user.
 * Accepts: email and password.
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  User.findByEmail(email, async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Return full user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
      },
    });
  });
};
