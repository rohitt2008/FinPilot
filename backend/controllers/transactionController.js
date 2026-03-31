import Transaction from "../models/Transaction.js";
import { validationResult } from "express-validator";




// Add Transaction
export const addTransaction = async (req, res) => {
  const errors = validationResult(req);
  
 
if (!errors.isEmpty()) {
  return res.status(400).json({
    message: errors.array()[0].msg
  });
}
  try {
    const { amount, type, category, description } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      type,
      category,
      description,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Transactions (for logged-in user)
export const getTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { type, category } = req.query;

    const skip = (page - 1) * limit;

    // 🔥 BUILD FILTER OBJECT
    let filter = {
      userId: req.user._id,
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    // 🔥 FETCH DATA
    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 🔥 TOTAL COUNT (for pagination later)
    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const exportTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    let csv = "Amount,Type,Category,Description,Date\n";

    transactions.forEach((t) => {
      csv += `${t.amount},${t.type},${t.category},${t.description || ""},${t.date}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

