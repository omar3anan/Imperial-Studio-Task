// /lambda/auth/login.js
const bcrypt = require('bcryptjs'); // Using bcryptjs instead of bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    // Validate required fields
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required.' }),
      };
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials.' }),
      };
    }

    // Compare passwords using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials.' }),
      };
    }

    // Create JWT token for user
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
  } catch (err) {
    console.error('Login error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
