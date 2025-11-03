import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.course_id,
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        CAST(c.price AS DECIMAL(10,2)) AS price,
        CAST(c.discounted_price AS DECIMAL(10,2)) AS discounted_price,
        c.level,
        c.language,
        c.duration_minutes,
        cat.name AS category_name,
        cat.slug AS category_slug,
        u.full_name AS instructor_name,
        u.avatar_url AS instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN users u ON c.teacher_id = u.user_id
      WHERE c.is_published = 1
    `;

    const params = [];

    if (category) {
      query += " AND cat.slug = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (c.title LIKE ? OR c.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === "price_asc") {
      query += " ORDER BY c.discounted_price ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY c.discounted_price DESC";
    } else if (sort === "newest") {
      query += " ORDER BY c.created_at DESC";
    } else {
      query += " ORDER BY c.course_id DESC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [courses] = await pool.query(query, params);

    // Convert price fields to number explicitly
    const formattedCourses = courses.map((course) => ({
      ...course,
      price: parseFloat(course.price),
      discounted_price: parseFloat(course.discounted_price),
    }));

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      WHERE c.is_published = 1
    `;
    const countParams = [];

    if (category) {
      countQuery += " AND cat.slug = ?";
      countParams.push(category);
    }
    if (search) {
      countQuery += " AND (c.title LIKE ? OR c.description LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: formattedCourses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error in GET /courses:", error);
    next(error);
  }
});

// GET /api/courses/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [courses] = await pool.query(
      `SELECT 
        c.*,
        CAST(c.price AS DECIMAL(10,2)) AS price,
        CAST(c.discounted_price AS DECIMAL(10,2)) AS discounted_price,
        cat.name AS category_name,
        cat.slug AS category_slug,
        u.full_name AS instructor_name,
        u.email AS instructor_email,
        u.avatar_url AS instructor_avatar,
        u.bio AS instructor_bio
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN users u ON c.teacher_id = u.user_id
      WHERE c.course_id = ? AND c.is_published = 1`,
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Convert price fields to number
    const course = {
      ...courses[0],
      price: parseFloat(courses[0].price),
      discounted_price: parseFloat(courses[0].discounted_price),
    };

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("❌ Error in GET /courses/:id:", error);
    next(error);
  }
});

export default router;
