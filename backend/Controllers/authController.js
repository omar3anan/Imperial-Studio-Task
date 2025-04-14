const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Register a new user.
 * Accepts: name, email, password.
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };

    User.create(user, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      // Return full user data
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: results.insertId,
          name,
          email,
          profilePicture: null, // Or your default value if you have one
        },
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
