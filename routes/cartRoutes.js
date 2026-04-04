const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

// @route   GET /api/cart
router.get('/', getCart);

// @route   POST /api/cart/add
router.post('/add', addToCart);

// @route   POST /api/cart/update
router.post('/update', updateCart);

// @route   DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', removeFromCart);

// @route   DELETE /api/cart/clear
router.delete('/clear', clearCart);

module.exports = router;
