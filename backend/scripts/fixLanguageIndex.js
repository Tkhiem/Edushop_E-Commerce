import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixLanguageIndex = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("courses");

    // List all indexes
    console.log("\n📋 Current indexes:");
    const indexes = await collection.indexes();
    indexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop text index if exists
    const textIndexes = indexes.filter(
      (idx) => idx.name && idx.name.includes("text")
    );

    if (textIndexes.length > 0) {
      console.log("\n🗑️  Dropping text indexes...");
      for (const idx of textIndexes) {
        await collection.dropIndex(idx.name);
        console.log(`  ✅ Dropped: ${idx.name}`);
      }
    } else {
      console.log("\n✅ No text indexes found");
    }

    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixLanguageIndex();
