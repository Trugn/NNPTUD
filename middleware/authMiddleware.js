const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');
const LoginAttempt = require('../models/LoginAttempt');

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Check permissions
exports.checkPermission = (requiredPermissions) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const User = require('../models/User');
      const Permission = require('../models/Permission');

      const user = await User.findById(req.userId).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'User account is inactive' });
      }

      const userPermissions = [];
      user.roles.forEach((role) => {
        role.permissions.forEach((perm) => {
          userPermissions.push(perm.name);
        });
      });

      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        // Log audit
        await AuditLog.create({
          user: req.userId,
          action: 'update',
          resource: 'User',
          status: 'failed',
          errorMessage: 'Permission denied',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });

        return res
          .status(403)
          .json({ error: 'Permission denied', requiredPermissions });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Rate limiting for login attempts
exports.trackLoginAttempt = async (email, isSuccess, failureReason = null, req) => {
  try {
    await LoginAttempt.create({
      email,
      isSuccess,
      failureReason,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Check for brute force (5 failed attempts in 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const failedAttempts = await LoginAttempt.countDocuments({
      email,
      isSuccess: false,
      createdAt: { $gte: fifteenMinutesAgo },
    });

    return failedAttempts >= 5;
  } catch (error) {
    console.error('Error tracking login attempt:', error);
    return false;
  }
};

// Log audit
exports.logAudit = async (userId, action, resource, resourceId = null, changes = null, status = 'success', errorMessage = null, req) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      resource,
      resourceId,
      changes,
      status,
      errorMessage,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};
