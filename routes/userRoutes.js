const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Public user routes
router.get('/me', asyncHandler(authController.getCurrentUser));
router.get('/', authMiddleware.checkPermission(['read_user']), asyncHandler(userController.getAllUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.put('/:id', asyncHandler(userController.updateUser));
router.post('/logout', asyncHandler(authController.logout));
router.post('/change-password', asyncHandler(userController.changePassword));
router.post('/upload-avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar));

// Admin routes
router.post('/', authMiddleware.checkPermission(['create_user']), asyncHandler(userController.createUser));
router.delete('/:id', authMiddleware.checkPermission(['delete_user']), asyncHandler(userController.deleteUser));
router.patch('/:id/toggle-status', authMiddleware.checkPermission(['update_user']), asyncHandler(userController.toggleUserStatus));

module.exports = router;
