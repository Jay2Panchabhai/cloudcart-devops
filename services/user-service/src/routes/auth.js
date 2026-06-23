// auth.js - Register, Login, Profile routes
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "cloudcart-super-secret-key-change-in-production";

// POST /api/users/register
// Why bcrypt? Storing plain passwords is catastrophic. bcrypt hashes passwords
// with a salt so even if the database is leaked, passwords cannot be reversed.
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const [existing] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password with bcrypt (cost factor 12 = secure, not too slow)
      const passwordHash = await bcrypt.hash(password, 12);

      // Insert new user
      const [result] = await db.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash],
      );

      // Generate JWT token
      const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(201).json({
        message: "Registration successful",
        token,
        user: { id: result.insertId, name, email },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// POST /api/users/login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const [users] = await db.execute(
        "SELECT id, name, email, password_hash FROM users WHERE email = ?",
        [email],
      );

      if (users.length === 0) {
        // Use same error for user-not-found AND wrong-password
        // This prevents email enumeration attacks
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET /api/users/profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users/health
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "user-service",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;