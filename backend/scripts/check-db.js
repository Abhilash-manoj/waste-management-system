import dotenv from 'dotenv';
dotenv.config();
import pool from '../config/db.js';

async function check() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Successfully connected to the database as', process.env.DB_USER || '(no user)');
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

check();
