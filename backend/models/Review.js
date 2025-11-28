import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // ❌ XÓA: index: true
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ GIỮ chỉ 1 index definition
reviewSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
