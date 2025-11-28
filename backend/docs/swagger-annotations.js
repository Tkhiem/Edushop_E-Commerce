/**
 * SWAGGER DOCUMENTATION FOR EDUSHOP API
 * 
 * Copy và paste các annotations dưới đây vào từng route file tương ứng
 * Đặt ngay trước mỗi router.get/post/put/delete
 */

// ==================== AUTH ROUTES ====================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Thông tin đăng nhập không chính xác
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa xác thực
 */

// ==================== COURSES ROUTES ====================

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Lấy danh sách khóa học với filter và pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục (có thể nhiều category, phân cách bằng dấu phẩy)
 *         example: Lập Trình Web,Thiết Kế Đồ Họa
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Lọc theo cấp độ
 *         example: Beginner
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu (USD)
 *         example: 0
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa (USD)
 *         example: 200
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề, mô tả, giảng viên
 *         example: javascript
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, popular, rating, price-asc, price-desc]
 *         description: Sắp xếp kết quả
 *         example: newest
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Số items mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalCourses:
 *                           type: integer
 */

/**
 * @swagger
 * /api/courses/slug/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết khóa học theo slug
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của khóa học
 *         example: ultimate-investment-banking-course
 *     responses:
 *       200:
 *         description: Chi tiết khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *                     relatedCourses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *       404:
 *         description: Không tìm thấy khóa học
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Tạo khóa học mới (Admin only)
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
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Lập trình React từ cơ bản đến nâng cao"
 *               slug:
 *                 type: string
 *                 example: "lap-trinh-react-tu-co-ban-den-nang-cao"
 *               description:
 *                 type: string
 *                 example: "Khóa học giúp bạn làm chủ React và xây dựng ứng dụng web hiện đại"
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/course-image.jpg"
 *               price:
 *                 type: number
 *                 example: 50
 *                 description: "Giá theo USD"
 *               originalPrice:
 *                 type: number
 *                 example: 75
 *               discountPercentage:
 *                 type: number
 *                 example: 33
 *               category:
 *                 type: string
 *                 example: "Lập Trình Web"
 *               instructor:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, all levels]
 *                 example: "intermediate"
 *               language:
 *                 type: string
 *                 example: "Vietnamese"
 *               duration:
 *                 type: number
 *                 example: 10.5
 *                 description: "Thời lượng tính theo giờ"
 *               lectures:
 *                 type: number
 *                 example: 50
 *               isBestseller:
 *                 type: boolean
 *                 example: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["react", "javascript", "frontend"]
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *                 message:
 *                   type: string
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Lấy thông tin khóa học theo ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Chi tiết khóa học
 *       404:
 *         description: Không tìm thấy khóa học
 *   put:
 *     summary: Cập nhật khóa học (Admin only)
 *     tags: [Courses]
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
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy khóa học
 *   delete:
 *     summary: Xóa khóa học (Admin only)
 *     tags: [Courses]
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
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /api/courses/search/suggestions:
 *   get:
 *     summary: Gợi ý tìm kiếm khóa học
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *         example: javascript
 *     responses:
 *       200:
 *         description: Danh sách gợi ý
 */

// ==================== CATEGORIES ROUTES ====================

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/with-counts:
 *   get:
 *     summary: Lấy danh sách danh mục kèm số lượng khóa học
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục với số lượng khóa học
 */

// ==================== FAVORITES ROUTES ====================

/**
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     summary: Lấy danh sách khóa học yêu thích của user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách yêu thích
 *   post:
 *     summary: Thêm khóa học vào danh sách yêu thích
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm thành công
 *   delete:
 *     summary: Xóa toàn bộ danh sách yêu thích
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /api/favorites/{userId}/{courseId}:
 *   delete:
 *     summary: Xóa một khóa học khỏi danh sách yêu thích
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

// ==================== REVIEWS ROUTES ====================

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
 *         description: Danh sách đánh giá
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Lấy tất cả đánh giá (Admin)
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách tất cả đánh giá
 *   post:
 *     summary: Tạo đánh giá mới
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - rating
 *             properties:
 *               courseId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Cập nhật đánh giá
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa đánh giá
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

// ==================== ORDERS ROUTES ====================

/**
 * @swagger
 * /api/orders/create-order:
 *   post:
 *     summary: Tạo đơn hàng mới với PayPal
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Đơn hàng được tạo
 */

/**
 * @swagger
 * /api/orders/capture-order/{orderId}:
 *   post:
 *     summary: Xác nhận thanh toán đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Lấy thông tin đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 */
