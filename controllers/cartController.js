const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check inventory
  if (product.inventory < quantity) {
    return res.status(400).json({ message: 'Not enough inventory' });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Check if product already in cart
  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // Calculate total price
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price inventory');

  res.status(200).json({
    success: true,
    message: 'Product added to cart',
    data: cart,
  });
});

// @desc    Update cart item quantity
// @route   POST /api/cart/update
// @access  Private
exports.updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!productId || quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  // Find cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Find item in cart
  const item = cart.items.find(item => item.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ message: 'Product not in cart' });
  }

  // If quantity is 0, remove item
  if (quantity === 0) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
  } else {
    // Check inventory
    const product = await Product.findById(productId);
    if (product.inventory < quantity) {
      return res.status(400).json({ message: 'Not enough inventory' });
    }
    item.quantity = quantity;
  }

  // Calculate total price
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price inventory');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: cart,
  });
});

// @desc    Remove product from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  // Find cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Remove item
  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  // Calculate total price
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price inventory');

  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    data: cart,
  });
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price inventory image');
  
  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { user: userId, items: [], totalPrice: 0 },
    });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart,
  });
});
