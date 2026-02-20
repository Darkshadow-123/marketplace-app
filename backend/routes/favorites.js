const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('favorites');
    res.json(updatedUser.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('favorites');
    res.json(updatedUser.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/check/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(req.params.productId);
    res.json({ isFavorite });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
