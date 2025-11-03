import dotenv from "dotenv";
import pool from "../config/database.js";
import {
  getUdemyCategories,
  getMockInstructors,
  getMockCourses,
} from "../services/udemyMockData.js";

dotenv.config();

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║  🌱 EDUSHOP DATA SEEDER - MOCK DATA                   ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ========== 1. CLEAN DATABASE ==========
    console.log("🧹 Cleaning existing data...\n");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("DELETE FROM review");
    await connection.query("DELETE FROM favorites");
    await connection.query("DELETE FROM carts");
    await connection.query("DELETE FROM order_items");
    await connection.query("DELETE FROM orders");
    await connection.query("DELETE FROM courses");
    await connection.query("DELETE FROM users WHERE role_id = 2"); // Chỉ xóa instructors
    await connection.query("DELETE FROM categories");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Database cleaned\n");

    // ========== 2. INSERT CATEGORIES ==========
    console.log("📂 Inserting categories...\n");
    const categories = getUdemyCategories();
    const categoryMap = {}; // { slug: category_id }

    for (const cat of categories) {
      const [result] = await connection.query(
        `INSERT INTO categories (name, slug, description, udemy_category_id, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [cat.name, cat.slug, cat.description, cat.udemy_category_id]
      );
      categoryMap[cat.slug] = result.insertId;
      console.log(`  ✅ ${cat.name} (ID: ${result.insertId})`);
    }
    console.log("");

    // ========== 3. INSERT INSTRUCTORS ==========
    console.log("👨‍🏫 Inserting instructors...\n");
    const instructors = getMockInstructors();
    const instructorMap = {}; // { email: user_id }

    for (const inst of instructors) {
      const [result] = await connection.query(
        `INSERT INTO users (full_name, email, password, avatar_url, bio, udemy_instructor_id, role_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          inst.full_name,
          inst.email,
          inst.password,
          inst.avatar_url,
          inst.bio,
          inst.udemy_instructor_id,
          inst.role_id,
        ]
      );
      instructorMap[inst.email] = result.insertId;
      console.log(`  ✅ ${inst.full_name} (ID: ${result.insertId})`);
    }
    console.log("");

    // ========== 4. INSERT COURSES ==========
    console.log("📚 Inserting courses...\n");
    const mockCourses = getMockCourses();
    let totalCourses = 0;

    for (const [categorySlug, courses] of Object.entries(mockCourses)) {
      console.log(`\n[${categorySlug.toUpperCase()}]`);

      for (const course of courses) {
        try {
          const teacherId = instructorMap[course.instructor_email];
          const categoryId = categoryMap[course.category_slug];

          if (!teacherId) {
            console.error(
              `  ❌ Instructor not found: ${course.instructor_email}`
            );
            continue;
          }

          if (!categoryId) {
            console.error(`  ❌ Category not found: ${course.category_slug}`);
            continue;
          }

          const [result] = await connection.query(
            `INSERT INTO courses (
              title, slug, description, long_description, thumbnail_url,
              price, discounted_price, level, language, duration_minutes,
              teacher_id, category_id, udemy_course_id, is_from_udemy, is_published,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              course.title,
              course.slug,
              course.description,
              course.long_description,
              course.thumbnail_url,
              course.price,
              course.discounted_price,
              course.level,
              course.language,
              course.duration_minutes,
              teacherId,
              categoryId,
              course.udemy_course_id,
              course.is_from_udemy,
              course.is_published,
            ]
          );

          totalCourses++;
          console.log(
            `  ✅ ${course.title.substring(0, 60)}... (ID: ${result.insertId})`
          );
        } catch (error) {
          console.error(`  ❌ Error inserting course: ${error.message}`);
        }
      }
    }

    // ========== 5. COMMIT ==========
    await connection.commit();
    console.log(
      "\n\n╔════════════════════════════════════════════════════════╗"
    );
    console.log("║  🎉 SEEDING COMPLETED!                                ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      `║  ✅ Categories: ${categories.length.toString().padEnd(40)}║`
    );
    console.log(
      `║  ✅ Instructors: ${instructors.length.toString().padEnd(39)}║`
    );
    console.log(`║  ✅ Courses: ${totalCourses.toString().padEnd(43)}║`);
    console.log("╚════════════════════════════════════════════════════════╝\n");
  } catch (error) {
    await connection.rollback();
    console.error("\n❌ SEEDING FAILED:", error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedDatabase();
