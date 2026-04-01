const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const Session = require('../models/Session');
const EmailVerification = require('../models/EmailVerification');
const PasswordReset = require('../models/PasswordReset');
const AuditLog = require('../models/AuditLog');
const { trackLoginAttempt, logAudit } = require('../middleware/authMiddleware');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRE = '24h';
const REFRESH_TOKEN_EXPIRE = '7d';

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, fullName } = req.body;

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email or username already exists' 
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      fullName: fullName || username,
      isVerified: false,
    });

    await user.save();

    // Create verification token
    const { token, tokenHash } = EmailVerification.generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await EmailVerification.create({
      user: user._id,
      email,
      token,
      tokenHash,
      expiresAt,
    });

    // Log audit
    await logAudit(user._id, 'create', 'User', user._id, null, 'success', null, req);

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
      verificationToken: token, // In production, send via email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const verification = await EmailVerification.findOne({
      tokenHash,
      isVerified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update user
    await User.findByIdAndUpdate(verification.user, { isVerified: true });

    // Mark verification as verified
    verification.isVerified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, deviceName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check brute force
    const isBruteForce = await trackLoginAttempt(email, false, null, req);
    if (isBruteForce) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password').populate('roles');

    if (!user) {
      await trackLoginAttempt(email, false, 'invalid_credentials', req);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await trackLoginAttempt(email, false, 'invalid_credentials', req);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check email verification
    if (!user.isVerified) {
      await trackLoginAttempt(email, false, 'email_not_verified', req);
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    // Check user status
    if (!user.isActive) {
      await trackLoginAttempt(email, false, 'account_inactive', req);
      return res.status(403).json({ error: 'Your account is inactive' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    const refreshTokenData = {
      user: user._id,
      token: crypto.randomBytes(64).toString('hex'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    };

    const savedRefreshToken = await RefreshToken.create(refreshTokenData);

    // Create session
    await Session.create({
      user: user._id,
      accessToken,
      refreshToken: savedRefreshToken._id,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      deviceName: deviceName || 'Unknown Device',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Track successful login
    await trackLoginAttempt(email, true, null, req);

    // Log audit
    await logAudit(user._id, 'login', 'User', user._id, null, 'success', null, req);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken: savedRefreshToken.token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        roles: user.roles,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        {
          isRevoked: true,
          revokedAt: new Date(),
        }
      );

      await Session.findOneAndUpdate(
        { refreshToken: { $exists: true } },
        { logoutAt: new Date(), isActive: false }
      );
    }

    // Log audit
    await logAudit(req.userId, 'logout', 'User', req.userId, null, 'success', null, req);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const token = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).populate('user');

    if (!token) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: token.user._id, email: token.user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Generate new refresh token
    const newRefreshTokenData = {
      user: token.user._id,
      token: crypto.randomBytes(64).toString('hex'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      replacedByToken: token.token,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    };

    const newRefreshToken = await RefreshToken.create(newRefreshTokenData);

    // Revoke old refresh token
    token.isRevoked = true;
    token.revokedAt = new Date();
    await token.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If email exists, password reset link will be sent' });
    }

    // Generate reset token
    const { token, tokenHash } = PasswordReset.generateResetToken();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await PasswordReset.create({
      user: user._id,
      token,
      tokenHash,
      expiresAt,
      ipAddress: req.ip,
    });

    // Log audit
    await logAudit(user._id, 'update', 'User', user._id, null, 'success', null, req);

    res.json({
      message: 'Password reset link sent to email',
      resetToken: token, // In production, send via email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await PasswordReset.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update password
    const user = await User.findById(resetToken.user);
    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetToken.isUsed = true;
    resetToken.usedAt = new Date();
    await resetToken.save();

    // Log audit
    await logAudit(user._id, 'update', 'User', user._id, null, 'success', null, req);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('roles').select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
