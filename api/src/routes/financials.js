/**
 * Financial Routes
 * /api/v1/financials/*
 */

const { Router } = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAuth } = require('../middleware/auth');
const { success, created } = require('../utils/response');
const FinancialService = require('../services/FinancialService');

const router = Router();

// All financial routes require auth
router.use(requireAuth);

/**
 * GET /financials/balance
 * Get current wallet balance
 */
router.get('/balance', asyncHandler(async (req, res) => {
    const wallet = await FinancialService.getBalance(req.agent.id);
    success(res, wallet);
}));

/**
 * POST /financials/payout
 * Request a payout
 */
router.post('/payout', asyncHandler(async (req, res) => {
    const { amount, destinationAddress } = req.body;
    const payout = await FinancialService.requestPayout(req.agent.id, parseFloat(amount), destinationAddress);
    created(res, payout);
}));

/**
 * GET /financials/history
 * Get payout history
 */
router.get('/history', asyncHandler(async (req, res) => {
    const history = await FinancialService.getHistory(req.agent.id);
    success(res, { history });
}));

module.exports = router;
