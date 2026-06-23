const express = require("express");
const db = require("../db");
const router = express.Router();

// GET /api/products - List all products with optional search and category filter
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // Count total for pagination
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [products] = await db.execute(query, params);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/categories - Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT category FROM products ORDER BY category",
    );
    res.json({ categories: rows.map((r) => r.category) });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req, res) => {
  try {
    const [products] = await db.execute("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: products[0] });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/health
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "product-service" });
});

module.exports = router;