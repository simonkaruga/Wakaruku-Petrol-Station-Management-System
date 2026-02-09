const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Validation handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      success: true,
      data: users.map(u => ({
        id: u.user_id,
        username: u.username,
        email: u.email,
        role: u.role,
        isActive: u.is_active,
        twoFaEnabled: u.two_fa_enabled,
        lastLogin: u.last_login,
        createdAt: u.created_at
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        twoFaEnabled: user.two_fa_enabled,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Admin
router.post('/',
  [
    body('username').isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    body('role').isIn(['admin', 'manager', 'bookkeeper', 'attendant', 'accountant'])
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      if (await User.usernameExists(username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
      if (await User.emailExists(email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      const user = await User.create({ username, email, password, role });
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { id: user.user_id, username: user.username, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Failed to create user' });
    }
  }
);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
router.put('/:id',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['admin', 'manager', 'bookkeeper', 'attendant', 'accountant']),
    body('isActive').optional().isBoolean()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const updateData = {};
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.role) updateData.role = req.body.role;
      if (req.body.isActive !== undefined) updateData.is_active = req.body.isActive;

      const updated = await User.update(req.params.id, updateData);
      res.json({
        success: true,
        message: 'User updated successfully',
        data: { id: updated.user_id, username: updated.username, email: updated.email, role: updated.role }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  }
);

// @desc    Reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Admin
router.put('/:id/reset-password',
  [body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await User.updatePassword(req.params.id, req.body.newPassword);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
  }
);

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.user_id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await User.deactivate(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

module.exports = router;
