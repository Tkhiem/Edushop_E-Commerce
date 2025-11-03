import pool from "../config/database.js";

/**
 * Lấy danh sách tất cả courses
 * GET /api/courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM courses");

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách khóa học",
      error: error.message,
    });
  }
};

/**
 * Lấy 1 course theo ID
 * GET /api/courses/:id
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin khóa học",
      error: error.message,
    });
  }
};

/**
 * Tạo course mới
 * POST /api/courses
 */
export const createCourse = async (req, res) => {
  try {
    const { name, type, category, level, price, originalPrice, description } =
      req.body;

    // Validation cơ bản
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (name, price)",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO courses (name, type, category, level, price, originalPrice, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, type, category, level, price, originalPrice, description]
    );

    res.status(201).json({
      success: true,
      message: "Tạo khóa học thành công",
      data: {
        id: result.insertId,
        ...req.body,
      },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo khóa học",
      error: error.message,
    });
  }
};

/**
 * Cập nhật course
 * PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Tạo câu SQL động dựa trên fields có trong request
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id];

    const [result] = await pool.query(
      `UPDATE courses SET ${fields} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật khóa học thành công",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khóa học",
      error: error.message,
    });
  }
};

/**
 * Xóa course
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    res.json({
      success: true,
      message: "Xóa khóa học thành công",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa khóa học",
      error: error.message,
    });
  }
};
