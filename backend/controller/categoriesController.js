import Category from "../models/Category.js";
import Course from "../models/Course.js";

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get categories with course counts
 * @route   GET /api/categories/with-counts
 * @access  Public
 */
export const getCategoriesWithCounts = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Get course count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const courseCount = await Course.countDocuments({
          category: category.name,
        });
        return {
          ...category,
          courseCount,
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories with counts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get course count
    const courseCount = await Course.countDocuments({
      category: category.name,
    });

    res.json({ ...category, courseCount });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get course count
    const courseCount = await Course.countDocuments({
      category: category.name,
    });

    res.json({ ...category, courseCount });
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new category (Admin only)
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { name, slug, icon, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      icon,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update category (Admin only)
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { name, slug, icon, description } = req.body;

    console.log("📝 Updating category:", req.params.id);
    console.log("New data:", { name, slug, icon, description });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, icon, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update all courses using the old category name
    if (req.body.name && req.body.name !== category.name) {
      const oldName = await Category.findById(req.params.id).then(c => c.name);
      await Course.updateMany(
        { category: oldName },
        { category: name }
      );
      console.log(`✅ Updated courses from "${oldName}" to "${name}"`);
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete category (Admin only)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has courses
    const courseCount = await Course.countDocuments({
      category: category.name,
    });

    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${courseCount} courses are using this category.`,
        courseCount,
      });
    }

    await category.deleteOne();
    console.log(`🗑️ Deleted category: ${category.name}`);
    
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
