const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdminMiddleware = require('../middleware/checkAdminMiddleware');
const categoryUpload = require('../middleware/categoryUploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

// Public routes (no authentication required)
router.get(
  '/active',
  asyncHandler(categoryController.getActiveCategories)
);

router.get(
  '/slug/:slug',
  asyncHandler(categoryController.getCategoryBySlug)
);

// Get all categories (authenticated users)
router.get(
  '/',
  authMiddleware.verifyToken,
  asyncHandler(categoryController.getAllCategories)
);

router.get(
  '/:id',
  authMiddleware.verifyToken,
  asyncHandler(categoryController.getCategoryById)
);

// Create category (Admin only)
router.post(
  '/',
  authMiddleware.verifyToken,
  checkAdminMiddleware.checkAdmin,
  categoryUpload.single('image'),
  asyncHandler(categoryController.createCategory)
);

// Update category (Admin only)
router.put(
  '/:id',
  authMiddleware.verifyToken,
  checkAdminMiddleware.checkAdmin,
  categoryUpload.single('image'),
  asyncHandler(categoryController.updateCategory)
);

// Delete category (Admin only)
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  checkAdminMiddleware.checkAdmin,
  asyncHandler(categoryController.deleteCategory)
);

// Toggle category status (Admin only)
router.patch(
  '/:id/toggle-status',
  authMiddleware.verifyToken,
  checkAdminMiddleware.checkAdmin,
  asyncHandler(categoryController.toggleCategoryStatus)
);

module.exports = router;
