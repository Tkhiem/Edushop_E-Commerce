import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/**
 * GET /api/favorites/:userId
 * Lấy danh sách yêu thích của user
 */
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const [items] = await pool.query(
      `SELECT 
        f.favorite_id,
        c.*,
        cat.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM Favorites f
      JOIN Courses c ON f.course_id = c.course_id
      LEFT JOIN Categories cat ON c.category_id = cat.category_id
      LEFT JOIN Review r ON c.course_id = r.course_id
      WHERE f.user_id = ?
      GROUP BY c.course_id`,
      [userId]
    );

    res.json({
      success: true,
      count: items.length,
      data: items.map((item) => ({
        id: item.favorite_id.toString(),
        userId,
        productId: item.course_id.toString(),
        product: {
          id: item.course_id.toString(),
          name: item.title,
          price: parseFloat(item.discounted_price || item.price),
          originalPrice: parseFloat(item.price),
          image: item.thumbnail_url,
          category: item.category_name,
          rating: parseFloat(item.avg_rating).toFixed(1),
          reviewCount: parseInt(item.review_count),
        },
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/favorites
 * Thêm vào yêu thích
 */
router.post("/", async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (userId, productId)",
      });
    }

    // Check if already exists
    const [existing] = await pool.query(
      "SELECT * FROM Favorites WHERE user_id = ? AND course_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Đã có trong danh sách yêu thích",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO Favorites (user_id, course_id) VALUES (?, ?)",
      [userId, productId]
    );

    res.status(201).json({
      success: true,
      message: "Đã thêm vào yêu thích",
      data: {
        id: result.insertId.toString(),
        userId,
        productId,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/favorites/:id
 * Xóa khỏi yêu thích
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Favorites WHERE favorite_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trong danh sách yêu thích",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa khỏi yêu thích",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
