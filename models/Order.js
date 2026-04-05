const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
      },
      ward: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "bank_transfer",
        "cash_on_delivery",
        "paypal",
      ],
      default: "cash_on_delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Tính toán lại totalAmount từ items
OrderSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0,
  );
};

// Populate user và product thông tin trước khi trả về
OrderSchema.pre(/^find/, function () {
  this.populate("user", "username email fullName phone avatar").populate(
    "items.product",
    "name price image",
  );
});

module.exports = mongoose.model("Order", OrderSchema);
