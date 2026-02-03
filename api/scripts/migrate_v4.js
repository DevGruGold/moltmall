const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function migrate() {
    console.log('Starting V4 migration (Supabase Auth)...');

    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not defined in environment variables.');
        process.exit(1);
    }

    const connectionString = process.env.DATABASE_URL.replace('moltmall_app', 'postgres');
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const schemaPath = path.join(__dirname, 'schema_v4_supabase_auth.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema_v4_supabase_auth.sql...');
        await pool.query(schemaSql);
        console.log('Migration V4 completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
