// routes/feedbackRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserFeedback,
  submitFeedback,
  removeFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();
router.use(protect);

/**
 * @route   GET /api/feedback
 * @desc    Get current user's feedback entries
 */
router.get("/", getUserFeedback);

/**
 * @route   POST /api/feedback
 * @desc    Submit or update movie feedback
 */
router.post("/", submitFeedback);

/**
 * @route   DELETE /api/feedback/:movieId
 * @desc    Remove feedback for a specific movie
 */
router.delete("/:movieId", removeFeedback);

export default router;
