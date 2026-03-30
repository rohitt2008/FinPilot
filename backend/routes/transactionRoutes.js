import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController.js";

import protect from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { exportTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);


router.post(
  "/",
  protect,
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("type").isIn(["income", "expense"]),
    body("category").notEmpty().withMessage("Category required"),
  ],
  addTransaction
);
router.put("/:id", protect, updateTransaction);
router.get("/export", protect, exportTransactions);

export default router;