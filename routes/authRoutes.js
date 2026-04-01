const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');

// Public routes
router.post('/register', asyncHandler(authController.register));
router.post('/verify-email', asyncHandler(authController.verifyEmail));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh-token', asyncHandler(authController.refreshToken));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/reset-password', asyncHandler(authController.resetPassword));

module.exports = router;
