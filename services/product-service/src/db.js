const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'cloudcart_user',
  password: process.env.DB_PASSWORD || 'cloudcart_pass',
  database: process.env.DB_NAME || 'cloudcart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Product DB connected');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Product DB failed:', err.message);
    process.exit(1);
  });

module.exports = pool;