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
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be positive"),
    body("type")
      .isIn(["income", "expense"])
      .withMessage("Type must be income or expense"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  addTransaction
);
router.put(
  "/:id",
  protect,
  [
    body("amount").optional().isFloat({ gt: 0 }),
    body("type").optional().isIn(["income", "expense"]),
    body("category").optional().notEmpty(),
  ],
  updateTransaction
);
router.get("/export", protect, exportTransactions);

export default router;