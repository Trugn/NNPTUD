const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdminMiddleware = require('../middleware/checkAdminMiddleware');
const productUpload = require('../middleware/productUploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

// Public routes (no authentication required)
router.get('/', asyncHandler(productController.getAllProducts));

router.get('/:id', asyncHandler(productController.getProductById));

router.get('/category/:categoryId', asyncHandler(productController.getProductsByCategory));

// Create product (Admin only)
router.post(
    '/',
    authMiddleware.verifyToken,
    // checkAdminMiddleware.checkAdmin,
    productUpload.single('image'),
    asyncHandler(productController.createProduct)
);

// Update product (Admin only)
router.put(
    '/:id',
    authMiddleware.verifyToken,
    // checkAdminMiddleware.checkAdmin,
    productUpload.single('image'),
    asyncHandler(productController.updateProduct)
);

// Delete product (Admin only)
router.delete(
    '/:id',
    authMiddleware.verifyToken,
    // checkAdminMiddleware.checkAdmin,
    asyncHandler(productController.deleteProduct)
);

// Add inventory to product (Admin only)
router.patch(
    '/:id/add-inventory',
    authMiddleware.verifyToken,
    // checkAdminMiddleware.checkAdmin,
    asyncHandler(productController.addInventory)
);

// Reduce inventory when product is sold (Admin only)
router.patch(
    '/:id/reduce-inventory',
    authMiddleware.verifyToken,
    // checkAdminMiddleware.checkAdmin,
    asyncHandler(productController.reduceInventory)
);

module.exports = router;
