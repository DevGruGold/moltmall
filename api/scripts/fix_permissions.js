const { Pool } = require('pg');
const config = require('../src/config');

// Construct postgres superuser URL assuming same password
const dbUrl = config.database.url.replace('moltmall_app', 'postgres');

async function fixPermissions() {
    console.log('Attempting to fix permissions as postgres user...');
    console.log('URL:', dbUrl.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: config.database.ssl
    });

    try {
        await pool.query("GRANT ALL ON SCHEMA public TO moltmall_app");
        console.log('Granted ALL on SCHEMA public');

        await pool.query("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moltmall_app");
        console.log('Granted ALL on ALL TABLES');

        await pool.query("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moltmall_app");
        console.log('Granted ALL on ALL SEQUENCES');

        console.log('Permissions fixed successfully!');
    } catch (err) {
        console.error('Fix failed:', err.message);
    } finally {
        await pool.end();
    }
}

fixPermissions();
