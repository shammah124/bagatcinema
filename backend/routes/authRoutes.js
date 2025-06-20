// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and return JWT
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user info
 * @access  Private
 */
router.get("/me", protect, getCurrentUser);

export default router;
