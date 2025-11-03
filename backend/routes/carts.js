import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/**
 * GET /api/carts/:userId
 * Lấy giỏ hàng của user
 */
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const [items] = await pool.query(
      `SELECT 
        cart.cart_item_id,
        cart.quantity,
        c.*,
        cat.name as category_name
      FROM Carts cart
      JOIN Courses c ON cart.course_id = c.course_id
      LEFT JOIN Categories cat ON c.category_id = cat.category_id
      WHERE cart.user_id = ?`,
      [userId]
    );

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + parseFloat(item.discounted_price || item.price) * item.quantity,
      0
    );

    res.json({
      success: true,
      count: items.length,
      totalAmount,
      data: items.map((item) => ({
        id: item.cart_item_id.toString(),
        userId,
        productId: item.course_id.toString(),
        quantity: item.quantity,
        product: {
          id: item.course_id.toString(),
          name: item.title,
          price: parseFloat(item.discounted_price || item.price),
          originalPrice: parseFloat(item.price),
          image: item.thumbnail_url,
          category: item.category_name,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/carts
 * Thêm vào giỏ hàng
 */
router.post("/", async (req, res, next) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (userId, productId)",
      });
    }

    // Check if already in cart
    const [existing] = await pool.query(
      "SELECT * FROM Carts WHERE user_id = ? AND course_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        "UPDATE Carts SET quantity = quantity + ? WHERE user_id = ? AND course_id = ?",
        [quantity, userId, productId]
      );
    } else {
      // Insert new
      await pool.query(
        "INSERT INTO Carts (user_id, course_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/carts/:id
 * Xóa khỏi giỏ hàng
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Carts WHERE cart_item_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa khỏi giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/carts/user/:userId/clear
 * Xóa toàn bộ giỏ hàng
 */
router.delete("/user/:userId/clear", async (req, res, next) => {
  try {
    const { userId } = req.params;

    await pool.query("DELETE FROM Carts WHERE user_id = ?", [userId]);

    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
