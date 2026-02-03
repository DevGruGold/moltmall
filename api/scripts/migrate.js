const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../src/config');

async function migrate() {
    console.log('Starting migration...');

    if (!config.database.url) {
        console.error('Error: DATABASE_URL is not defined in environment variables.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: config.database.url,
        ssl: config.database.ssl
    });

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema.sql...');
        await pool.query(schemaSql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
