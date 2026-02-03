
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    try {
        const client = await pool.connect();
        console.log("Connected to database!");

        // Check for agents table
        const res = await client.query('SELECT count(*) FROM agents');
        console.log(`Agent count: ${res.rows[0].count}`);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

checkDb();
