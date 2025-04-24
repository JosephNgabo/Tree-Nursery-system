require('dotenv').config();  // Load environment variables from the .env file

const { Pool } = require('pg');

// Log the database connection attempt
console.log("Connecting to the database...");

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false // Enable SSL if DB_SSL is set to 'true'

});
// Optionally, log any errors or successful connection events
pool.on('connect', () => {
  console.log("Database connected successfully");
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection test failed:', err);
  } else {
    console.log('Database connection test successful');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
