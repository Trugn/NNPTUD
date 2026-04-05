const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) filter.orderStatus = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user is the owner or admin
    const isOwner = order.user.toString() === req.userId;
    const isAdmin = req.user?.roles?.some((role) => role.name === "admin");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    let { items, shippingAddress, paymentMethod, notes } = req.body;
    const userId = req.userId;

    // If no items provided, get from cart
    if (!items || items.length === 0) {
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
      );
      if (!cart || cart.items.length === 0) {
        return res
          .status(400)
          .json({ error: "Cart is empty or no items provided" });
      }
      items = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
    }

    // Validate shippingAddress
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Verify products and prepare items
    const preparedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product ${product.name}` });
      }

      const subtotal = product.price * item.quantity;
      preparedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // Create order
    const order = new Order({
      user: userId,
      items: preparedItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
      notes,
    });

    await order.save();

    // Update product stock
    for (const item of preparedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permission
    const isOwner = order.user.toString() === req.userId;
    const isAdmin = req.user?.roles?.some((role) => role.name === "admin");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Only allow updating certain fields
    const allowedFields = ["shippingAddress", "notes", "paymentMethod"];

    if (isAdmin) {
      allowedFields.push(
        "orderStatus",
        "paymentStatus",
        "trackingNumber",
        "cancelReason",
      );
    }

    // If user is updating and order is already processing, prevent changes
    if (
      !isAdmin &&
      (order.orderStatus === "shipped" ||
        order.orderStatus === "delivered" ||
        order.orderStatus === "cancelled")
    ) {
      return res
        .status(400)
        .json({ error: "Cannot update order with current status" });
    }

    // Update only allowed fields
    for (const field of allowedFields) {
      if (field in updateData) {
        order[field] = updateData[field];
      }
    }

    await order.save();

    res.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel order (User cancels their own order)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permission - user can only cancel their own order
    const isOwner = order.user.toString() === req.userId;
    if (!isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ error: "Cannot cancel order with current status" });
    }

    // Revert stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true },
      );
    }

    order.orderStatus = "cancelled";
    order.cancelReason = cancelReason || "User requested cancellation";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order (Admin cancels any order)
exports.cancelOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ error: "Cannot cancel order with current status" });
    }

    // Revert stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true },
      );
    }

    order.orderStatus = "cancelled";
    order.cancelReason = cancelReason || "Admin cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow deletion of pending or cancelled orders
    if (!["pending", "cancelled"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ error: "Can only delete pending or cancelled orders" });
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order statistics (Admin only)
exports.getOrderStatistics = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      orders: stats,
      payments: paymentStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
