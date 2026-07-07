const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// POST /api/orders
// Place an order from the current user's cart
router.post('/', async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Get current cart items
    const [cartItems] = await connection.execute(`
      SELECT
        ci.product_id,
        ci.quantity,
        p.price,
        p.stock,
        p.name
      FROM cart_items ci
      JOIN products p
        ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.user.userId]);

    if (cartItems.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        error: 'Cart is empty'
      });
    }

    // Step 2: Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();

        return res.status(400).json({
          error:
            `Insufficient stock for ${item.name}. ` +
            `Available: ${item.stock}`
        });
      }
    }

    // Step 3: Calculate total
    const total = cartItems.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity),
      0
    );

    // Step 4: Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (user_id, total_amount, status)
       VALUES (?, ?, "confirmed")`,
      [
        req.user.userId,
        total.toFixed(2)
      ]
    );

    const orderId = orderResult.insertId;

    // Step 5: Insert order items and reduce stock
    for (const item of cartItems) {
      await connection.execute(
        `INSERT INTO order_items
         (
           order_id,
           product_id,
           quantity,
           price_at_purchase
         )
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price
        ]
      );

      await connection.execute(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ?`,
        [
          item.quantity,
          item.product_id
        ]
      );
    }

    // Step 6: Clear cart
    await connection.execute(
      'DELETE FROM cart_items WHERE user_id = ?',
      [req.user.userId]
    );

    // Step 7: Commit
    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total: total.toFixed(2),
      itemCount: cartItems.length
    });

  } catch (err) {
    await connection.rollback();

    console.error('Place order error:', err);

    res.status(500).json({
      error: 'Failed to place order'
    });
  } finally {
    connection.release();
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN order_items oi
        ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.userId]);

    res.json({
      orders
    });
  } catch (err) {
    console.error('Get orders error:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT *
       FROM orders
       WHERE id = ?
       AND user_id = ?`,
      [
        req.params.id,
        req.user.userId
      ]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    const [items] = await db.execute(`
      SELECT
        oi.*,
        p.name,
        p.image_url
      FROM order_items oi
      JOIN products p
        ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({
      order: {
        ...orders[0],
        items
      }
    });
  } catch (err) {
    console.error('Get order details error:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;