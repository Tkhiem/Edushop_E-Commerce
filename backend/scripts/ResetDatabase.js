import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    const db = mongoose.connection.db;

    // Drop courses collection
    try {
      await db.collection("courses").drop();
      console.log("✅ Dropped 'courses' collection");
    } catch (error) {
      if (error.message.includes("ns not found")) {
        console.log("ℹ️  'courses' collection doesn't exist");
      } else {
        throw error;
      }
    }

    // Drop categories collection
    try {
      await db.collection("categories").drop();
      console.log("✅ Dropped 'categories' collection");
    } catch (error) {
      if (error.message.includes("ns not found")) {
        console.log("ℹ️  'categories' collection doesn't exist");
      } else {
        throw error;
      }
    }

    console.log("\n✅ Database reset complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetDatabase();
