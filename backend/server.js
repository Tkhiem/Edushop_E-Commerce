import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerSpec from "./config/swagger.js";
import User from "./models/User.js";
// Routes
import authRoutes from "./routes/auth.js";
import coursesRoutes from "./routes/courses.js";
import categoriesRoutes from "./routes/categories.js";
import favoritesRoutes from "./routes/favorites.js";
import reviewsRoutes from "./routes/reviews.js";
import ordersRoutes from "./routes/orders.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartsRoutes from "./routes/carts.js";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "EduShop API Documentation",
    customfavIcon: "/favicon.ico",
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
    `,
  })
);

// Health check
app.get("/", (req, res) => {
  const port = process.env.PORT || 5000;
  const apiDocUrl = process.env.NODE_ENV === 'production' 
    ? `${req.protocol}://${req.get('host')}/api-docs`
    : `http://localhost:${port}/api-docs`;
  res.json({
    message: "EduShop API is running 🚀",
    version: "2.0.0",
    documentation: apiDocUrl,
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      categories: "/api/categories",
      favorites: "/api/favorites",
      reviews: "/api/reviews",
      orders: "/api/orders",
    },
  });
});
app.get("/export-emails", async (req, res) => {
  try {
    const users = await User.find({}, "full_name name email");
    console.log("user", users);
    // Tạo header cho CSV
    let csv = "name,email\n";

    // Thêm từng user vào CSV
    users.forEach((u) => {
      const displayName = u.full_name ? u.full_name : u.name;
      csv += `${displayName},${u.email}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("emails.csv"); // khi truy cập URL sẽ tải file về
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/carts", cartsRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
