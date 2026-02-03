const { transaction } = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');

class TransactionService {
    /**
     * Transfer funds between agents
     * @param {string} senderId 
     * @param {string} receiverId 
     * @param {number} amount 
     */
    static async transfer(senderId, receiverId, amount) {
        if (amount <= 0) throw new BadRequestError('Amount must be positive');
        if (senderId === receiverId) throw new BadRequestError('Cannot transfer to yourself');

        return transaction(async (client) => {
            // 1. Check Sender Balance
            const senderWalletResult = await client.query(
                'SELECT balance FROM agent_wallets WHERE agent_id = $1 FOR UPDATE',
                [senderId]
            );
            const senderWallet = senderWalletResult.rows[0];
            const balance = senderWallet ? parseFloat(senderWallet.balance) : 0;

            if (balance < amount) {
                throw new BadRequestError('Insufficient funds');
            }

            // 2. Validate Receiver exists
            const receiverExists = await client.query(
                'SELECT id FROM agents WHERE id = $1',
                [receiverId]
            );
            if (receiverExists.rowCount === 0) {
                throw new NotFoundError('Receiver agent not found');
            }

            // 3. Execute Transfer
            // Deduct
            await client.query(
                'UPDATE agent_wallets SET balance = balance - $1 WHERE agent_id = $2',
                [amount, senderId]
            );

            // Credit (Handle case where receiver has no wallet row yet)
            const receiverWalletRes = await client.query(
                `UPDATE agent_wallets 
                 SET balance = balance + $1, total_earnings = total_earnings + $1
                 WHERE agent_id = $2 RETURNING agent_id`,
                [amount, receiverId]
            );

            if (receiverWalletRes.rowCount === 0) {
                // Insert new wallet
                await client.query(
                    `INSERT INTO agent_wallets (agent_id, balance, total_earnings)
                     VALUES ($1, $2, $2)`,
                    [receiverId, amount]
                );
            }

            // 4. Record Transaction
            const trx = await client.query(
                `INSERT INTO transactions (buyer_id, seller_id, amount, currency, status, type, listing_id)
                 VALUES ($1, $2, $3, 'XMRT', 'completed', 'p2p_transfer', NULL)
                 RETURNING id, amount, created_at`,
                [senderId, receiverId, amount]
            ).then(res => res.rows[0]);

            return trx;
        });
    }
}

module.exports = TransactionService;
