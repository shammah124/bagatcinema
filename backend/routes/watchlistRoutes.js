// routes/watchlistRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();
router.use(protect);

/**
 * @route   GET /api/watchlist
 * @desc    Get current user's watchlist
 */
router.get("/", getWatchlist);

/**
 * @route   POST /api/watchlist
 * @desc    Add a movie to watchlist
 */
router.post("/", addToWatchlist);

/**
 * @route   DELETE /api/watchlist/:movieId
 * @desc    Remove a movie from watchlist
 */
router.delete("/:movieId", removeFromWatchlist);

export default router;
