import express from "express";
import Review from "../models/Review.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come before general routes to avoid conflicts

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     summary: Lấy tất cả đánh giá (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Không có quyền truy cập (cần admin)
 *       401:
 *         description: Chưa đăng nhập
 */
// Get all reviews for admin (Admin only) - MUST be before GET /
router.get("/all", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const reviews = await Review.find({})
      .populate("user_id", "full_name email")
      .populate("course_id", "title")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reviews/course/{courseId}:
 *   get:
 *     summary: Lấy danh sách đánh giá của một khóa học
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       userAvatar:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
// Get reviews by course ID - MUST be before GET /
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const reviews = await Review.find({ course_id: courseId })
      .populate("user_id", "full_name avatar_url")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const transformedReviews = reviews.map((review) => ({
      id: review._id.toString(),
      userId: review.user_id._id.toString(),
      userName: review.user_id.full_name,
      userAvatar: review.user_id.avatar_url,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      helpful: 0, // Placeholder, implement if needed
    }));

    res.json({
      success: true,
      data: transformedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tạo đánh giá mới cho khóa học (yêu cầu đăng nhập)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - rating
 *               - comment
 *             properties:
 *               course_id:
 *                 type: string
 *                 description: ID của khóa học
 *                 example: "673abc123def456789012345"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Đánh giá từ 1-5 sao
 *                 example: 5
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 description: Nội dung đánh giá (tối thiểu 10 ký tự)
 *                 example: "Khóa học rất hay và bổ ích"
 *           example:
 *             course_id: "673abc123def456789012345"
 *             rating: 5
 *             comment: "Khóa học rất tuyệt vời, giảng viên nhiệt tình"
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *       400:
 *         description: Thiếu thông tin hoặc đã đánh giá khóa học này
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy khóa học
 */
// Add a new review (requires authentication) - POST must be before GET /
router.post("/", authenticate, async (req, res) => {
  try {
    console.log("📝 Received review request body:", req.body);
    console.log("👤 User from token:", req.user._id);
    
    const { course_id, rating, comment } = req.body;
    const userId = req.user._id;

    console.log("🔍 Extracted fields:", { course_id, rating, comment, userId });

    // Validate input
    if (!course_id || !rating || !comment) {
      console.log("❌ Validation failed - Missing fields");
      return res.status(400).json({
        success: false,
        error: "Missing required fields: course_id, rating, comment",
        received: { course_id, rating, comment }
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if course exists
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({
      course_id: course_id,
      user_id: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // Create review
    const review = await Review.create({
      course_id: course_id,
      user_id: userId,
      rating,
      comment,
    });

    // Update course rating
    const reviews = await Review.find({ course_id: course_id });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Course.findByIdAndUpdate(course_id, {
      rating: avgRating,
      reviews: reviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user_id", "full_name")
      .lean();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        id: populatedReview._id.toString(),
        userId: populatedReview.user_id._id.toString(),
        userName: populatedReview.user_id.full_name,
        rating: populatedReview.rating,
        comment: populatedReview.comment,
        createdAt: populatedReview.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá cần xóa
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
 *                 message:
 *                   type: string
 *       403:
 *         description: Không có quyền (cần admin)
 *       404:
 *         description: Không tìm thấy đánh giá
 *       401:
 *         description: Chưa đăng nhập
 */
// Delete a review (Admin only)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const courseId = review.course_id;
    await Review.findByIdAndDelete(id);

    // Update course rating
    const reviews = await Review.find({ course_id: courseId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Course.findByIdAndUpdate(courseId, {
      rating: avgRating,
      reviews: reviews.length,
    });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
});

export default router;
