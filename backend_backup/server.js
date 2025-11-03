import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { testConnection } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Import routes
import ordersRouter from "./routes/orders.js";
import coursesRouter from "./routes/courses.js";
import categoriesRouter from "./routes/categories.js";
import reviewsRouter from "./routes/reviews.js";
import cartsRouter from "./routes/carts.js";
import favoritesRouter from "./routes/favorites.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// Middleware
// ===========================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ===========================
// Health Check
// ===========================
app.get("/", (req, res) => {
  res.json({
    message: "EduShop API Server",
    status: "running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection();

  res.json({
    status: "OK",
    message: "EduShop API is running!",
    database: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ===========================
// API Routes
// ===========================
app.use("/api/orders", ordersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/favorites", favoritesRouter);

// ===========================
// Error Handlers (PHẢI Ở CUỐI)
// ===========================
app.use(notFoundHandler);
app.use(errorHandler);

// ===========================
// Start Server
// ===========================
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.warn("⚠️  Server khởi động KHÔNG có database!");
      console.log("💡 Vẫn có thể test các route, nhưng sẽ lỗi khi query DB");
    }

    // Start server
    app.listen(PORT, () => {
      console.log("\n🚀 =======================================");
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Courses: http://localhost:${PORT}/api/courses`);
      console.log(`📂 API Categories: http://localhost:${PORT}/api/categories`);
      console.log(`⭐ API Reviews: http://localhost:${PORT}/api/reviews`);
      console.log(`🛒 API Carts: http://localhost:${PORT}/api/carts`);
      console.log(`❤️  API Favorites: http://localhost:${PORT}/api/favorites`);
      console.log("🚀 =======================================\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
