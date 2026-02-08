const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op, Sequelize } = require('sequelize');
const Shift = require('../models/shift');
const Sale = require('../models/sale');
const Expense = require('../models/expense');
const Product = require('../models/product');
const User = require('../models/user');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// @desc    Get all shifts
// @route   GET /api/shifts
// @access  Private
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, userId, status, startDate, endDate, month } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Handle month filter (YYYY-MM format)
    if (month) {
      const [year, monthNum] = month.split('-');
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);
      where.createdAt = {
        [Op.gte]: startOfMonth,
        [Op.lte]: endOfMonth
      };
    } else if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.startTime[Op.lte] = new Date(endDate);
      }
    }

    const shifts = await Shift.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['startTime', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'username', 'role']
        }
      ]
    });

    res.json({
      success: true,
      data: shifts.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(shifts.count / limit),
        totalShifts: shifts.count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get single shift
// @route   GET /api/shifts/:id
// @access  Private
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'username', 'role']
        }
      ]
    });

    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    // Get shift summary
    const sales = await Sale.findAll({
      where: { shiftId: shift.id },
      attributes: [
        'paymentMethod',
        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalAmount'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['paymentMethod'],
      raw: true
    });

    const expenses = await Expense.sum('amount', { where: { shiftId: shift.id } });

    res.json({
      success: true,
      data: {
        ...shift.toJSON(),
        salesSummary: sales,
        totalExpenses: expenses || 0
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Start new shift
// @route   POST /api/shifts
// @access  Private
router.post('/', 
  authenticateToken, 
  requirePermission('manage_sales'),
  async (req, res, next) => {
    try {
      const shift = await Shift.create({
        userId: req.user.id,
        attendantName: req.body.attendantName,
        shiftStartTime: req.body.shiftStartTime,
        startTime: req.body.shiftStartTime || new Date(),
        petrolOpening: req.body.petrolOpening,
        petrolClosing: req.body.petrolClosing,
        petrolBuyPrice: req.body.petrolBuyPrice,
        petrolSellPrice: req.body.petrolSellPrice,
        petrolTankStock: req.body.petrolTankStock,
        dieselOpening: req.body.dieselOpening,
        dieselClosing: req.body.dieselClosing,
        dieselBuyPrice: req.body.dieselBuyPrice,
        dieselSellPrice: req.body.dieselSellPrice,
        dieselTankStock: req.body.dieselTankStock,
        keroseneOpening: req.body.keroseneOpening,
        keroseneClosing: req.body.keroseneClosing,
        keroseneBuyPrice: req.body.keroseneBuyPrice,
        keroseneSellPrice: req.body.keroseneSellPrice,
        keroseneTankStock: req.body.keroseneTankStock,
        fuelCashCollected: req.body.fuelCashCollected,
        fuelMpesaCollected: req.body.fuelMpesaCollected,
        carWashesCount: req.body.carWashesCount,
        carWashCash: req.body.carWashCash,
        parkingFeesCollected: req.body.parkingFeesCollected,
        gas6kgSold: req.body.gas6kgSold,
        gas13kgSold: req.body.gas13kgSold,
        gasCashCollected: req.body.gasCashCollected,
        gasMpesaCollected: req.body.gasMpesaCollected,
        openingCash: req.body.openingCash || 0,
        status: 'closed'
      });

      res.status(201).json({
        success: true,
        data: shift
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Close shift
// @route   PUT /api/shifts/:id/close
// @access  Private
router.put('/:id/close', authenticateToken, requirePermission('manage_sales'), async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    if (shift.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Shift is not active'
      });
    }

    const { closingCash, notes } = req.body;

    // Calculate expected cash
    const salesTotal = await Sale.sum('totalAmount', { where: { shiftId: shift.id } });
    const expensesTotal = await Expense.sum('amount', { where: { shiftId: shift.id } });
    const expectedCash = shift.openingCash + (salesTotal || 0) - (expensesTotal || 0);

    const cashDifference = (closingCash || 0) - expectedCash;

    await shift.update({
      endTime: new Date(),
      closingCash: closingCash || 0,
      expectedCash,
      cashDifference,
      status: 'closed',
      notes: notes || null,
      totalSales: salesTotal || 0,
      totalExpenses: expensesTotal || 0
    });

    res.json({
      success: true,
      data: shift,
      message: 'Shift closed successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update shift (Admin only, must be unlocked)
// @route   PUT /api/shifts/:id
// @access  Private/Admin
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update shifts'
      });
    }

    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    // Check if shift is locked
    if (shift.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Cannot update locked shift. Unlock it first.'
      });
    }

    // Update shift with provided data
    await shift.update(req.body);

    res.json({
      success: true,
      message: 'Shift updated successfully',
      data: shift
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get shift summary
// @route   GET /api/shifts/:id/summary
// @access  Private
router.get('/:id/summary', authenticateToken, async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    const sales = await Sale.findAll({
      where: { shiftId: shift.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name']
        }
      ]
    });

    const expenses = await Expense.findAll({
      where: { shiftId: shift.id },
      include: [
        {
          model: User,
          as: 'approvedByUser',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        shift,
        sales,
        expenses,
        summary: {
          totalSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
          totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
          netSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Unlock shift for editing (Admin only)
// @route   PUT /api/shifts/:id/unlock
// @access  Private/Admin
router.put('/:id/unlock', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can unlock shifts'
      });
    }

    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    await shift.update({ isLocked: false });

    res.json({
      success: true,
      message: 'Shift unlocked successfully',
      data: shift
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Lock shift (Admin only)
// @route   PUT /api/shifts/:id/lock
// @access  Private/Admin
router.put('/:id/lock', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can lock shifts'
      });
    }

    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return next(new ErrorResponse('Shift not found', 404));
    }

    await shift.update({ isLocked: true });

    res.json({
      success: true,
      message: 'Shift locked successfully',
      data: shift
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;