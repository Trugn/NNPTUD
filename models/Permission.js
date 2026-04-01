const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'create_user',
        'read_user',
        'update_user',
        'delete_user',
        'manage_roles',
        'manage_permissions',
        'view_logs',
        'export_data',
      ],
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    module: {
      type: String,
      enum: ['User', 'Role', 'Permission', 'System'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Permission', permissionSchema);
