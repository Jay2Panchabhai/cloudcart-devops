const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'cloudcart_user',
  password: process.env.DB_PASSWORD || 'cloudcart_pass',
  database: process.env.DB_NAME || 'cloudcart',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;