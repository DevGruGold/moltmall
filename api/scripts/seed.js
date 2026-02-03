const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../src/config');

async function seed() {
    console.log('Starting seed...');

    if (!config.database.url) {
        console.error('Error: DATABASE_URL is not defined in environment variables.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: config.database.url,
        ssl: config.database.ssl
    });

    try {
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Executing seed.sql...');
        await pool.query(seedSql);
        console.log('Seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
