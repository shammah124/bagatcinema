// routes/listRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createList,
  getListById,
  incrementListView,
  incrementListShare,
} from "../controllers/listController.js";

const router = express.Router();
router.use(protect);

/**
 * @route   POST /api/lists
 * @desc    Create a new movie list
 */
router.post("/", createList);

/**
 * @route   GET /api/lists/:id
 * @desc    Get a list by ID
 */
router.get("/:id", getListById);

/**
 * @route   POST /api/lists/:id/view
 * @desc    Increment view count for a list
 */
router.post("/:id/view", incrementListView);

/**
 * @route   POST /api/lists/:id/share
 * @desc    Increment share count for a list
 */
router.post("/:id/share", incrementListShare);

export default router;
