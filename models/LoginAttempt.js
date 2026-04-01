const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    isSuccess: {
      type: Boolean,
      default: false,
    },
    failureReason: {
      type: String,
      enum: ['invalid_credentials', 'account_locked', 'email_not_verified', 'account_inactive'],
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    location: {
      country: String,
      city: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm login attempts gần đây
loginAttemptSchema.index({ email: 1, createdAt: -1 });
loginAttemptSchema.index({ ipAddress: 1, createdAt: -1 });

// TTL Index - xóa log sau 30 ngày
loginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
