// Database configuration and connection setup for Supabase PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to Supabase PostgreSQL database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connections
  },
  connectionTimeoutMillis: 5000 // 5 second timeout for connection attempts
});

// Test the database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.stack);
  } else {
    console.log('✅ Successfully connected to Supabase PostgreSQL database');
    release();
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client:', err);
  process.exit(-1);
});

module.exports = pool;
