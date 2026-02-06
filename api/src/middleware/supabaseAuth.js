const { createClient } = require('@supabase/supabase-js');
const { UnauthorizedError } = require('../utils/errors');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const requireSupabaseAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('[SupabaseAuth] Token validation failed:', error?.message || 'No user found');
            throw new UnauthorizedError('Invalid token');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { requireSupabaseAuth, supabase };
