const { Router } = require('express');
const { requireSupabaseAuth } = require('../middleware/supabaseAuth');
const { asyncHandler } = require('../middleware/errorHandler');
const { success } = require('../utils/response');
const AgentService = require('../services/AgentService');
const { pool } = require('../config/database'); // Direct DB access for custom query until Service updated

const router = Router();

/**
 * POST /auth/sync
 * Sync Supabase user with Agent system
 */
router.post('/sync', requireSupabaseAuth, asyncHandler(async (req, res) => {
    const supabaseId = req.user.id;
    const email = req.user.email;

    // Check if agent exists for this supabase ID
    // TODO: Move this query to AgentService after DB migration applies
    const { rows } = await pool.query(
        'SELECT * FROM agents WHERE supabase_user_id = $1',
        [supabaseId]
    );

    let agent = rows[0];

    if (!agent) {
        return success(res, {
            status: 'profile_required',
            user: { id: supabaseId, email }
        });
    }

    // Generate legacy JWT if needed for backward compatibility
    // Or just return the agent
    const token = AgentService.generateToken(agent.id);

    success(res, {
        status: 'authenticated',
        agent,
        token
    });
}));

module.exports = router;
