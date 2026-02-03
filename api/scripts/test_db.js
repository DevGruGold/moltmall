const { Pool } = require('pg');
const config = require('../src/config');

async function test() {
    console.log('Testing DB connection...');
    const pool = new Pool({
        connectionString: config.database.url,
        ssl: config.database.ssl
    });

    try {
        const res = await pool.query('SELECT current_user, session_user');
        console.log('Connected as:', res.rows[0]);

        try {
            await pool.query('CREATE TABLE IF NOT EXISTS test_perm (id serial primary key)');
            console.log('CREATE TABLE permission: OK');
            await pool.query('DROP TABLE test_perm');
        } catch (e) {
            console.log('CREATE TABLE permission: FAILED', e.message);
        }

        try {
            await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            console.log('CREATE EXTENSION permission: OK');
        } catch (e) {
            console.log('CREATE EXTENSION permission: FAILED', e.message);
        }

    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

test();
