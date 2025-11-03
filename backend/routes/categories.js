import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/**
 * GET /api/categories
 * Lấy tất cả categories
 */
router.get("/", async (req, res, next) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        cat.*,
        COUNT(c.course_id) as course_count
      FROM Categories cat
      LEFT JOIN Courses c ON cat.category_id = c.category_id AND c.is_published = true
      GROUP BY cat.category_id
      ORDER BY cat.name
    `);

    res.json({
      success: true,
      count: categories.length,
      data: categories.map((cat) => ({
        id: cat.category_id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        courseCount: parseInt(cat.course_count || 0),
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/categories/:id
 * Lấy 1 category theo ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.query(
      "SELECT * FROM Categories WHERE category_id = ?",
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.json({
      success: true,
      data: {
        id: categories[0].category_id.toString(),
        name: categories[0].name,
        slug: categories[0].slug,
        description: categories[0].description,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
