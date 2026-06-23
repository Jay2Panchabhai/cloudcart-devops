const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "cloudcart",
  waitForConnections: true,
  connectionLimit: 10, // Max 10 concurrent DB connections
  queueLimit: 0, // Unlimited queue when all connections are busy
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Crash the pod so Kubernetes restarts it
  });

module.exports = pool;