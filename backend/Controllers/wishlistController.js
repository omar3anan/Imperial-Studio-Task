// controllers/wishlistController.js
const Wishlist = require('../models/wishlistModel');

exports.addToWishlist = (req, res) => {
  const { productId, userId } = req.params;

  Wishlist.add(userId, productId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error. Could not add to wishlist.' });
    }

    // If product already exists, result.message is set.
    if (result && result.message) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
      message: 'Product added to wishlist successfully',
      wishlist_entry: result
    });
  });
};

exports.getUserWishlist = (req, res) => {
  const { userId } = req.params;

  Wishlist.getByUserId(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error. Could not retrieve wishlist.' });
    }

    // results will be an array of product IDs
    res.status(200).json({
      wishlist: results.map(entry => entry.product_id)
    });
  });
};

// NEW: Remove a product from wishlist
exports.removeFromWishlist = (req, res) => {
  const { productId, userId } = req.params;

  Wishlist.remove(userId, productId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error. Could not remove from wishlist.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Wishlist entry not found.' });
    }
    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  });
};
