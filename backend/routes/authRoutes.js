const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload', authController.uploadProfilePicture); // Route to upload profile picture


module.exports = router;