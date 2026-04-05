const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  verifyToken,
  checkPermission,
} = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

// All routes require authentication
router.use(verifyToken);

// User routes
router.post("/", asyncHandler(orderController.createOrder)); // Create order
router.get("/me", asyncHandler(orderController.getUserOrders)); // Get user's orders
router.get("/me/:id", asyncHandler(orderController.getOrderById)); // Get user's specific order
router.put("/me/:id", asyncHandler(orderController.updateOrder)); // Update user's order
router.patch("/me/:id/cancel", asyncHandler(orderController.cancelOrder)); // Cancel user's order

// Admin routes
router.get(
  "/",
  checkPermission(["view_orders"]),
  asyncHandler(orderController.getAllOrders),
); // Get all orders
router.get(
  "/stats",
  checkPermission(["view_orders"]),
  asyncHandler(orderController.getOrderStatistics),
); // Get order statistics
router.get(
  "/:id",
  checkPermission(["view_orders"]),
  asyncHandler(orderController.getOrderById),
); // Get specific order
router.put(
  "/:id",
  checkPermission(["update_orders"]),
  asyncHandler(orderController.updateOrder),
); // Update order
router.patch(
  "/:id/status",
  checkPermission(["update_orders"]),
  asyncHandler(orderController.updateOrderStatus),
); // Update order status
router.delete(
  "/:id",
  checkPermission(["delete_orders"]),
  asyncHandler(orderController.deleteOrder),
); // Delete order

module.exports = router;
