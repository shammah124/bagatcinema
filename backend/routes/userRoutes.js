// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getUserIds,
  getAllUsers,
  getUserById,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

// Protect all user routes
router.use(protect);

/**
 * @route   GET /api/user/profile
 * @desc    Get current user's profile
 */
router.get("/profile", getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update current user's profile/preferences
 */
router.put("/profile", updateProfile);

router.delete("/delete", deleteAccount);

/**
 * @route   GET /api/user/ids
 * @desc    Get list of all user IDs
 */
router.get("/ids", getUserIds);

/**
 * @route   GET /api/user/all
 * @desc    Get all user profiles
 */
router.get("/all", getAllUsers);

/**
 * @route   GET /api/user/:userId
 * @desc    Get a specific user by ID
 */
router.get("/:userId", getUserById);

export default router;
