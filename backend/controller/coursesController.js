import Course from "../models/Course.js";

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "popular":
        sortOption = { students: -1 };
        break;
      case "newest":
      default:
        sortOption = { publishedDate: -1 };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const courses = await Course.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await Course.countDocuments(query);

    // ✅ RESPONSE FORMAT MỚI - Khớp với frontend
    res.json({
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCourses: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

/**
 * @desc    Get course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get featured courses
 * @route   GET /api/courses/featured
 * @access  Public
 */
export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isBestseller: true })
      .sort({ students: -1 })
      .limit(8)
      .lean();

    res.json(courses);
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};