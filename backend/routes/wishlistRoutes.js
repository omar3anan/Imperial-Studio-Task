const express = require('express');
const router = express.Router();
const wishlistController = require('../Controllers/wishlistController');

// Route to add a product to a user's wishlist
router.post('/:productId/user/:userId', wishlistController.addToWishlist);

// Route to get all wishlist items for a user
router.get('/user/:userId', wishlistController.getUserWishlist);

// NEW: Route to remove a product from a user's wishlist
router.delete('/:productId/user/:userId', wishlistController.removeFromWishlist);

module.exports = router;
