const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/products
// List products with optional search, category and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 12
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(
        `%${search}%`,
        `%${search}%`
      );
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Count total products before pagination
    const countQuery = query.replace(
      'SELECT *',
      'SELECT COUNT(*) as total'
    );

    const [countResult] = await db.execute(
      countQuery,
      params
    );

    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    params.push(
      parsedLimit,
      offset
    );

    const [products] = await db.execute(
      query,
      params
    );

    res.json({
      products,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (err) {
    console.error('Get products error:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );

    res.json({
      categories: rows.map(row => row.category)
    });
  } catch (err) {
    console.error('Get categories error:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/products/health
// IMPORTANT: keep this before /:id
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'product-service'
  });
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json({
      product: products[0]
    });
  } catch (err) {
    console.error('Get product error:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;