// routes/socialRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowerCount,
  getAllUsers,
  getUserWatchlist,
} from "../controllers/socialController.js";

const router = express.Router();
router.use(protect);

/**
 * @route   POST /api/social/follow/:userId
 * @desc    Follow a user
 */
router.post("/follow/:userId", followUser);

/**
 * @route   DELETE /api/social/unfollow/:userId
 * @desc    Unfollow a user
 */
router.delete("/unfollow/:userId", unfollowUser);

/**
 * @route   GET /api/social/following
 * @desc    Get users you are following
 */
router.get("/following", getFollowing);

/**
 * @route   GET /api/social/followers
 * @desc    Get your followers
 */
router.get("/followers", getFollowers);

/**
 * @route   GET /api/social/:userId/followers/count
 * @desc    Get a user's follower count
 */
router.get("/:userId/followers/count", getFollowerCount);

/**
 * @route   GET /api/social/users
 * @desc    Get all users (id, name, username, email)
 */
router.get("/users", getAllUsers);

/**
 * @route   GET /api/social/:userId/watchlist
 * @desc    Get another user's watchlist
 */
router.get("/:userId/watchlist", getUserWatchlist);

export default router;
