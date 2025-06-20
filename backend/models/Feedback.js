// models/Feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: { type: String, required: true },
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

FeedbackSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Feedback", FeedbackSchema);
