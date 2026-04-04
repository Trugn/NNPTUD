const User = require('../models/User');

// Check if user is admin
exports.checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('roles');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    // Check if user has admin role
    const isAdmin = user.roles.some((role) => role.name === 'admin');
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: 'Only admin can access this resource' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
