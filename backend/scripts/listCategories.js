import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

const listCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const categories = await Category.find().lean();
    
    console.log(`\n📋 Found ${categories.length} categories:\n`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. Name: "${cat.name}"`);
      console.log(`   Slug: "${cat.slug}"`);
      console.log(`   ID: ${cat._id}`);
      console.log("");
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

listCategories();
