import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/**
 * GET /api/reviews/course/:courseId
 * Lấy reviews của 1 course
 */
router.get("/course/:courseId", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [reviews] = await pool.query(
      `SELECT 
        r.*,
        u.full_name as user_name,
        u.avatar_url as user_avatar
      FROM Review r
      LEFT JOIN Users u ON r.user_id = u.user_id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [courseId, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM Review WHERE course_id = ?",
      [courseId]
    );

    const [avgRating] = await pool.query(
      "SELECT AVG(rating) as avg_rating FROM Review WHERE course_id = ?",
      [courseId]
    );

    res.json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(avgRating[0].avg_rating || 0).toFixed(1),
      data: reviews.map((r) => ({
        id: r.review_id.toString(),
        productId: r.course_id.toString(),
        userId: r.user_id?.toString(),
        user: r.user_name || "Ẩn danh",
        avatar: r.user_avatar || "https://via.placeholder.com/50",
        rating: parseFloat(r.rating),
        comment: r.comment,
        date: r.created_at,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/reviews
 * Tạo review mới
 */
router.post("/", async (req, res, next) => {
  try {
    const { productId, userId, user, avatar, rating, comment } = req.body;

    // Validation
    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (productId, rating)",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO Review (course_id, user_id, rating, comment) 
       VALUES (?, ?, ?, ?)`,
      [productId, userId || null, rating, comment || null]
    );

    res.status(201).json({
      success: true,
      message: "Đánh giá thành công",
      data: {
        id: result.insertId.toString(),
        productId,
        userId,
        user,
        avatar,
        rating,
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/reviews/:id
 * Xóa review
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Review WHERE review_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
