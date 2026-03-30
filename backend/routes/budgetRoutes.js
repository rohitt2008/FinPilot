import express from "express";
import { setBudget } from "../controllers/budgetController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, setBudget);

export default router;