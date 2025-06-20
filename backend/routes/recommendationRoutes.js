// routes/recommendationRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();
router.use(protect);

router.get("/", protect, getRecommendations);

export default router;
