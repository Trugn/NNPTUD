const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { verifyToken, checkPermission } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

// Protected routes (require authentication)
router.use(verifyToken);

// Public user routes
router.get('/me', asyncHandler(authController.getCurrentUser));
router.get('/', checkPermission(['read_user']), asyncHandler(userController.getAllUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.put('/:id', asyncHandler(userController.updateUser));
router.post('/logout', asyncHandler(authController.logout));
router.post('/change-password', asyncHandler(userController.changePassword));
router.post('/upload-avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar));

// Admin routes
router.post('/', checkPermission(['create_user']), asyncHandler(userController.createUser));
router.delete('/:id', checkPermission(['delete_user']), asyncHandler(userController.deleteUser));
router.patch('/:id/toggle-status', checkPermission(['update_user']), asyncHandler(userController.toggleUserStatus));

module.exports = router;
