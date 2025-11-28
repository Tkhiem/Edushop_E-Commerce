import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║  ✅ MongoDB Atlas Connected Successfully!  ║");
    console.log("╠════════════════════════════════════════════╣");
    console.log(`║  📊 Database: ${conn.connection.name.padEnd(27)}║`);
    console.log(
      `║  🌍 Host: ${conn.connection.host.substring(0, 32).padEnd(32)}║`
    );
    console.log("╚════════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("╔════════════════════════════════════════════╗");
    console.error("║  ❌ MongoDB Connection Error              ║");
    console.error("╚════════════════════════════════════════════╝");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

export default connectDB;
