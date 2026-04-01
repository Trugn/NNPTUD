const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: ['login', 'logout', 'create', 'update', 'delete', 'permission_change'],
    },
    resource: {
      type: String,
      enum: ['User', 'Role', 'Permission', 'System'],
    },
    resourceId: {
      type: String,
    },
    changes: {
      before: {},
      after: {},
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho tìm kiếm nhanh
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
