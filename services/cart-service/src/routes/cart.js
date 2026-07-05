const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// GET /api/cart - View cart with product details
router.get('/', async (req, res) => {
  try {
    const [items] = await db.execute(`
      SELECT 
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.image_url,
        p.stock,
        (ci.quantity * p.price) AS subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [req.user.userId]);

    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({ items, total: total.toFixed(2), itemCount: items.length });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || quantity < 1) {
    return res.status(400).json({ error: 'Valid productId and quantity required' });
  }

  try {
    // Check product exists and has stock
    const [products] = await db.execute(
      'SELECT id, stock FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Insert or update using MySQL's ON DUPLICATE KEY UPDATE
    // If the user already has this item in their cart, increase quantity
    await db.execute(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [req.user.userId, productId, quantity]);

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/cart/:cartItemId - Update quantity
router.put('/:cartItemId', async (req, res) => {
  const { quantity } = req.body;
  
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Valid quantity required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.cartItemId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/cart/:cartItemId - Remove item
router.delete('/:cartItemId', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.cartItemId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;