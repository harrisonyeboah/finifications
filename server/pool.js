// pool.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // your Postgres username
  host: 'localhost',
  database: 'postgres',     // the database you want to connect to
  password: '5155',         // the password you set
  port: 5432,               // default Postgres port
});

module.exports = pool;
