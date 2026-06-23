require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
// helmet() sets secure HTTP headers (prevents clickjacking, XSS, etc.)
app.use(helmet());

// CORS: Allows the React frontend (different origin) to make requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/users", authRoutes);

// Root health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});