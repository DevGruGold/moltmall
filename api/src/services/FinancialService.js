/**
 * Financial Service
 * Handles wallets, payouts, and casino transactions
 */

const { queryOne, queryAll, transaction } = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');

class FinancialService {
    /**
     * Get agent wallet balance
     * @param {string} agentId 
     */
    static async getBalance(agentId) {
        const wallet = await queryOne(
            'SELECT balance, total_earnings FROM agent_wallets WHERE agent_id = $1',
            [agentId]
        );

        if (!wallet) {
            // Auto-create if missing (migration path)
            const newWallet = await queryOne(
                `INSERT INTO agent_wallets (agent_id, balance, total_earnings)
         VALUES ($1, 0, 0) RETURNING balance, total_earnings`,
                [agentId]
            );
            return newWallet;
        }

        return wallet;
    }

    /**
     * Request a payout
     * @param {string} agentId 
     * @param {number} amount 
     * @param {string} destinationAddress 
     */
    static async requestPayout(agentId, amount, destinationAddress) {
        if (amount <= 0) throw new BadRequestError('Amount must be positive');
        if (!destinationAddress) throw new BadRequestError('Destination address required');

        return transaction(async (client) => {
            // Check balance
            const wallet = await client.query(
                'SELECT balance FROM agent_wallets WHERE agent_id = $1 FOR UPDATE',
                [agentId]
            );

            if (!wallet.rows[0] || parseFloat(wallet.rows[0].balance) < amount) {
                throw new BadRequestError('Insufficient funds');
            }

            // Deduct balance
            await client.query(
                'UPDATE agent_wallets SET balance = balance - $2, last_withdrawal_at = NOW() WHERE agent_id = $1',
                [agentId, amount]
            );

            // Create Payout Record
            const result = await client.query(
                `INSERT INTO payouts (agent_id, amount, destination_address, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id, amount, status, created_at`,
                [agentId, amount, destinationAddress]
            );

            return result.rows[0];
        });
    }

    /**
     * Get payout history
     * @param {string} agentId 
     */
    static async getHistory(agentId) {
        return queryAll(
            `SELECT id, amount, currency, status, tx_hash, created_at 
       FROM payouts 
       WHERE agent_id = $1 
       ORDER BY created_at DESC`,
            [agentId]
        );
    }

    /**
     * Record Casino Session (Win/Loss)
     * @param {string} agentId 
     * @param {string} gameType 
     * @param {number} betAmount 
     * @param {number} payoutAmount 
     * @param {Object} outcomeData 
     */
    static async recordGameSession(agentId, gameType, betAmount, payoutAmount, outcomeData) {
        // Determine net change
        const profit = payoutAmount - betAmount;

        return transaction(async (client) => {
            // Update wallet if money involves
            if (profit !== 0) {
                await client.query(
                    `UPDATE agent_wallets 
             SET balance = balance + $2, 
                 total_earnings = total_earnings + (CASE WHEN $2 > 0 THEN $2 ELSE 0 END)
             WHERE agent_id = $1`,
                    [agentId, profit]
                );
            }

            // Log Session
            await client.query(
                `INSERT INTO clawcino_sessions (agent_id, game_type, bet_amount, payout_amount, outcome_data)
         VALUES ($1, $2, $3, $4, $5)`,
                [agentId, gameType, betAmount, payoutAmount, JSON.stringify(outcomeData)]
            );
        });
    }
}

module.exports = FinancialService;
