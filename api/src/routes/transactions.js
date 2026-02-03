/**
 * Transaction Routes
 * /api/v1/transactions/*
 */

const { Router } = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAuth } = require('../middleware/auth');
const { success } = require('../utils/response');
const TransactionService = require('../services/TransactionService');

const router = Router();

router.use(requireAuth);

/**
 * POST /transactions/transfer
 * Send XMRT to another agent
 */
router.post('/transfer', asyncHandler(async (req, res) => {
    const { receiverId, amount } = req.body;
    const result = await TransactionService.transfer(req.agent.id, receiverId, parseFloat(amount));
    success(res, result);
}));

module.exports = router;
