import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "edushop_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "+00:00", // ⭐ THÊM để đồng bộ timezone
});

// ⭐ THÊM function test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    console.log("📊 Database:", process.env.DB_NAME);
    console.log("🔗 Host:", process.env.DB_HOST);
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("💡 Checklist:");
    console.error("   1. XAMPP MySQL đã chạy chưa?");
    console.error('   2. Database "edushop_db" đã tạo chưa?');
    console.error("   3. Credentials trong .env đúng chưa?");
    return false;
  }
};

export default pool;
