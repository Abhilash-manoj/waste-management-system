import pool from './config/db.js';

async function testConnection() {
  try {
    const connection = await pool.getConnection(); // get a connection from pool
    console.log('✅ MySQL connection successful!');
    connection.release(); // release the connection back to the pool
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
  }
}

testConnection();
