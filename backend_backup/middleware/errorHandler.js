/**
 * Global Error Handler Middleware
 * Xử lý tất cả errors trong ứng dụng
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ===========================
  // MySQL/Database Errors
  // ===========================
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Dữ liệu đã tồn tại";
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 404;
    message = "Dữ liệu tham chiếu không tồn tại";
  }

  if (err.code === "ECONNREFUSED") {
    statusCode = 503;
    message = "Không thể kết nối đến database";
  }

  if (err.code === "ER_BAD_FIELD_ERROR") {
    statusCode = 400;
    message = "Trường dữ liệu không hợp lệ";
  }

  if (err.code === "ER_PARSE_ERROR") {
    statusCode = 400;
    message = "Lỗi cú pháp SQL";
  }

  // ===========================
  // Validation Errors
  // ===========================
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Dữ liệu không hợp lệ";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Định dạng ID không hợp lệ";
  }

  // ===========================
  // Authentication Errors (for future)
  // ===========================
  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Không có quyền truy cập";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token đã hết hạn";
  }

  // ===========================
  // Response
  // ===========================
  res.status(statusCode).json({
    success: false,
    message,
    error: err.message,
    // Chỉ show stack trace trong development
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: {
        code: err.code,
        name: err.name,
        sql: err.sql, // MySQL query nếu có
      },
    }),
  });
};

/**
 * 404 Not Found Handler
 * Xử lý khi API endpoint không tồn tại
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint không tồn tại",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};
