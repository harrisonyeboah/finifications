// testPool.js
const pool = require('./pool');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()'); // simple query
    console.log('Postgres is connected! Current time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end(); // close all connections
  }
}

testConnection();
