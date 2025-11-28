import express from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses with filtering, sorting, pagination
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const {
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    console.log("📥 GET /api/courses - Request params:", {
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sort,
      page,
      limit,
    });

    // Build query
    let query = {};

    // Category filter
    if (category) {
      const categories = category.split(",").map((cat) => cat.trim());
      query.category = { $in: categories };
      console.log("🏷️  Filtering by categories:", categories);
    }

    // Level filter
    if (level) {
      const levels = level.split(",").map((l) => l.trim());
      query.level = {
        $in: levels.map((l) => new RegExp(l, "i")),
      };
      console.log("📊 Filtering by levels:", levels);
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
      console.log("💰 Filtering by price range:", query.price);
    }

    // Search filter
    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
      
      // Check if search is a valid ObjectId format
      if (mongoose.Types.ObjectId.isValid(search) && search.match(/^[0-9a-fA-F]{24}$/)) {
        try {
          searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
          console.log("🔑 Added ObjectId search:", search);
        } catch (error) {
          console.log("⚠️  Invalid ObjectId format:", search);
        }
      }
      
      query.$or = searchConditions;
      console.log("🔍 Searching for:", search);
    }

    console.log("🗄️  MongoDB Query:", JSON.stringify(query));

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "popular":
        sortOption = { students: -1 };
        break;
      case "newest":
      default:
        sortOption = { publishedDate: -1 };
        break;
    }

    console.log("🔄 Sort option:", sortOption);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log("📄 Pagination:", { page: pageNum, limit: limitNum, skip });

    // Execute query
    const courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    console.log(`✅ Found ${courses.length} courses`);

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limitNum);

    console.log(
      `📊 Total: ${totalCourses} courses | Pages: ${totalPages} | Current: ${pageNum}`
    );

    // Return response
    res.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCourses,
        hasMore: pageNum < totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/courses/search/suggestions
 * @desc    Get search suggestions
 * @access  Public
 * ⚠️ MUST BE BEFORE /:id route
 */
router.get("/search/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const courses = await Course.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { instructor: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    })
      .select("title instructor category thumbnail slug")
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/courses/slug/:slug
 * @desc    Get course by slug
 * @access  Public
 * ⚠️ MUST BE BEFORE /:id route
 */
router.get("/slug/:slug", async (req, res) => {
  try {
    console.log("📥 GET /api/courses/slug/:slug -", req.params.slug);

    const course = await Course.findOne({ slug: req.params.slug }).lean();

    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log("✅ Course found:", course.title);

    // Get related courses (same category)
    const relatedCourses = await Course.find({
      category: course.category,
      _id: { $ne: course._id },
    })
      .limit(4)
      .lean();

    console.log(`✅ Found ${relatedCourses.length} related courses`);

    res.json({
      success: true,
      data: {
        course,
        relatedCourses,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Public
 * ⚠️ MUST BE AFTER /slug/:slug
 */
router.get("/:id", async (req, res) => {
  try {
    console.log("📥 GET /api/courses/:id -", req.params.id);

    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log("✅ Course found:", course.title);

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Tạo khóa học mới
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - category
 *               - instructor
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Lập trình React từ cơ bản đến nâng cao"
 *               slug:
 *                 type: string
 *                 example: "lap-trinh-react-tu-co-ban-den-nang-cao"
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *               price:
 *                 type: number
 *                 example: 50
 *               originalPrice:
 *                 type: number
 *               discountPercentage:
 *                 type: number
 *               category:
 *                 type: string
 *                 example: "Lập Trình Web"
 *               instructor:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, all levels]
 *               language:
 *                 type: string
 *               duration:
 *                 type: number
 *               lectures:
 *                 type: number
 *               isBestseller:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 *
 * @route   POST /api/courses
 * @desc    Create new course (Admin only)
 * @access  Private/Admin
 */
router.post("/", authenticate, async (req, res) => {
  try {
    console.log("📥 POST /api/courses - Request body:", JSON.stringify(req.body, null, 2));
    
    const course = await Course.create(req.body);

    console.log("✅ Course created successfully:", course._id);
    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating course:", error.message);
    console.error("Error details:", error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: errors.join(", "),
      });
    }
    
    // Handle duplicate key error (slug already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate error",
        error: "Khóa học với slug này đã tồn tại. Vui lòng thử lại.",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Cập nhật thông tin khóa học
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               instructor:
 *                 type: string
 *               level:
 *                 type: string
 *               duration:
 *                 type: number
 *               lectures:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy khóa học
 *       401:
 *         description: Chưa xác thực
 *
 * @route   PUT /api/courses/:id
 * @desc    Update course (Admin only)
 * @access  Private/Admin
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Xóa khóa học
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Course deleted successfully"
 *       404:
 *         description: Không tìm thấy khóa học
 *       401:
 *         description: Chưa xác thực
 *
 * @route   DELETE /api/courses/:id
 * @desc    Delete course (Admin only)
 * @access  Private/Admin
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;