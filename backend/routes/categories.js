import express from "express";
import {
  getCategories,
  getCategoriesWithCounts,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoriesController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   description:
 *                     type: string
 */
// Public routes
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories/with-counts:
 *   get:
 *     summary: Lấy danh mục kèm số lượng khóa học
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục với số lượng khóa học
 */
router.get("/with-counts", getCategoriesWithCounts);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Lấy danh mục theo slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/slug/:slug", getCategoryBySlug);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lập trình"
 *               slug:
 *                 type: string
 *                 example: "lap-trinh"
 *               icon:
 *                 type: string
 *                 example: "Code"
 *               description:
 *                 type: string
 *                 example: "Các khóa học về lập trình"
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Danh mục đã tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền (cần admin)
 */
// Admin routes - Require authentication and admin role
router.post("/", authenticate, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               icon:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put("/:id", authenticate, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Danh mục đang được sử dụng bởi các khóa học
 *       404:
 *         description: Không tìm thấy danh mục
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete("/:id", authenticate, deleteCategory);

export default router;
