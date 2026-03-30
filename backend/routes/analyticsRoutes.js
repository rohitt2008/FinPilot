import express from "express";
import { getAnalytics, getCategoryBreakdown , getMonthlyData ,getSmartInsights } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", protect, getAnalytics);
router.get("/categories", protect, getCategoryBreakdown);
router.get("/monthly", protect, getMonthlyData);
router.get("/smart-insights", protect, getSmartInsights);

export default router;