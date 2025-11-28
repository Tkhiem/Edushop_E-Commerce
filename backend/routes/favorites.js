import express from "express";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// Get favorites by user ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let favorites = await Favorite.findOne({ user_id: userId });

    if (!favorites) {
      favorites = await Favorite.create({ user_id: userId, courses: [] });
    }

    res.json({
      success: true,
      data: favorites.courses,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch favorites",
      message: error.message,
    });
  }
});

// Add to favorites
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    let favorites = await Favorite.findOne({ user_id: userId });

    if (!favorites) {
      favorites = await Favorite.create({
        user_id: userId,
        courses: [courseId],
      });
    } else {
      if (!favorites.courses.includes(courseId)) {
        favorites.courses.push(courseId);
        await favorites.save();
      }
    }

    res.json({
      success: true,
      data: favorites.courses,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add to favorites",
      message: error.message,
    });
  }
});

// Remove from favorites
router.delete("/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const favorites = await Favorite.findOne({ user_id: userId });

    if (favorites) {
      favorites.courses = favorites.courses.filter(
        (id) => id.toString() !== courseId
      );
      await favorites.save();
    }

    res.json({
      success: true,
      data: favorites ? favorites.courses : [],
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove from favorites",
      message: error.message,
    });
  }
});

// Clear all favorites
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await Favorite.findOneAndUpdate(
      { user_id: userId },
      { courses: [] },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Favorites cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear favorites",
      message: error.message,
    });
  }
});

export default router;
