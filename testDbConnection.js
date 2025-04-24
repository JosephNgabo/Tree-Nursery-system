const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // <-- Disable SSL
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to the database!');
    console.log('Current time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
})();
