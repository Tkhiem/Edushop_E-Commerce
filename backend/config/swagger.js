import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduShop API Documentation",
      version: "2.0.0",
      description: `API documentation cho hệ thống EduShop - Nền tảng học trực tuyến

⚠️ **CHÚ Ý XÁC THỰC (AUTHENTICATION)**:
- Các endpoint POST, PUT, DELETE yêu cầu JWT token
- Click nút 🔓 **"Authorize"** ở góc trên để thêm token
- Để lấy token admin: chạy \`node scripts/getAdminToken.js\` trong thư mục backend
- Hướng dẫn chi tiết: xem file SWAGGER_AUTH_GUIDE.md

📝 **ADMIN TEST ACCOUNT**:
- Email: admin@edushop.com
- Password: admin123`,
      contact: {
        name: "EduShop Team",
        email: "support@edushop.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.edushop.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "API quản lý đăng nhập, đăng ký và xác thực người dùng",
      },
      {
        name: "Courses",
        description: "API quản lý khóa học",
      },
      {
        name: "Categories",
        description: "API quản lý danh mục khóa học",
      },
      {
        name: "Carts",
        description: "API quản lý giỏ hàng",
      },
      {
        name: "Favorites",
        description: "API quản lý danh sách yêu thích",
      },
      {
        name: "Reviews",
        description: "API quản lý đánh giá khóa học",
      },
      {
        name: "Orders",
        description: "API quản lý đơn hàng và thanh toán",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: `🔑 Nhập JWT token để xác thực

⚠️ QUAN TRỌNG: Chỉ nhập TOKEN, KHÔNG thêm chữ "Bearer"
❌ SAI: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ ĐÚNG: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

📖 Hướng dẫn:
1. Chạy: node scripts/getAdminToken.js
2. Copy TOÀN BỘ token (bắt đầu từ eyJ...)
3. Paste vào ô Value bên dưới
4. Click "Authorize" → "Close"

Token có hiệu lực 7 ngày.`,
        },
      },
      schemas: {
        // Authentication Schemas
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            full_name: {
              type: "string",
              example: "Nguyễn Văn A",
            },
            email: {
              type: "string",
              format: "email",
              example: "nguyen.van.a@example.com",
            },
            role: {
              type: "string",
              enum: ["customer", "admin"],
              example: "customer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "customer1@test.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "123456",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["full_name", "email", "password"],
          properties: {
            full_name: {
              type: "string",
              example: "Nguyễn Văn A",
            },
            email: {
              type: "string",
              format: "email",
              example: "nguyen.van.a@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        // Course Schemas
        Course: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              example: "Complete Web Development Bootcamp",
            },
            slug: {
              type: "string",
              example: "complete-web-development-bootcamp",
            },
            description: {
              type: "string",
              example: "Học lập trình web từ cơ bản đến nâng cao",
            },
            thumbnail: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            price: {
              type: "number",
              example: 99.99,
            },
            originalPrice: {
              type: "number",
              example: 199.99,
            },
            discountPercentage: {
              type: "number",
              example: 50,
            },
            category: {
              type: "string",
              example: "Lập Trình Web",
            },
            instructor: {
              type: "string",
              example: "John Doe",
            },
            rating: {
              type: "number",
              example: 4.5,
            },
            students: {
              type: "number",
              example: 1000,
            },
            reviews: {
              type: "number",
              example: 150,
            },
            level: {
              type: "string",
              enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
              example: "Beginner",
            },
            language: {
              type: "string",
              example: "Tiếng Việt",
            },
            duration: {
              type: "number",
              description: "Thời lượng tính bằng phút",
              example: 1200,
            },
            lectures: {
              type: "number",
              example: 50,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["web", "javascript", "react"],
            },
            publishedDate: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Category Schema
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "Lập Trình Web",
            },
            slug: {
              type: "string",
              example: "lap-trinh-web",
            },
            courseCount: {
              type: "number",
              example: 150,
            },
          },
        },

        // Cart Schemas
        CartItem: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              example: "Complete Web Development Bootcamp",
            },
            price: {
              type: "number",
              example: 99.99,
            },
            thumbnail: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            instructor: {
              type: "string",
              example: "John Doe",
            },
            quantity: {
              type: "number",
              example: 1,
            },
            added_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            user_id: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Review Schema
        Review: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            course_id: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            user_id: {
              type: "string",
              example: "507f1f77bcf86cd799439013",
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: "string",
              example: "Khóa học rất hay và bổ ích!",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Response Schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              example: "Detailed error information",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
