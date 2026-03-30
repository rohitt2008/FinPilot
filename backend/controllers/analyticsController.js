import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

export const getAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    // 🔥 Get current month
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });

    // 🔥 Fetch budget
    const budget = await Budget.findOne({
      userId: req.user._id,
      month: currentMonth,
    });

    let alert = null;

if (budget && totalExpense > budget.amount) {
  alert = {
    message: "⚠️ Budget exceeded",
    exceededBy: totalExpense - budget.amount
  };
}

    res.json({
      totalIncome,
      totalExpense,
      balance,
      budget: budget ? budget.amount : null,
      alert,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    const breakdown = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      }
    });

    res.json(breakdown);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMonthlyData = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    const monthly = {};

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });

      monthly[month] = (monthly[month] || 0) + t.amount;
    });

    res.json(monthly);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSmartInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryMap = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    let insights = [];

    // 🔥 Spending vs income
    if (totalExpense > totalIncome) {
      insights.push("⚠️ You are spending more than you earn");
    }

    // 🔥 Highest category
    let maxCategory = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b,
      null
    );

    if (maxCategory) {
      insights.push(`💸 You spend most on ${maxCategory}`);
    }

    // 🔥 Percentage insight
    if (maxCategory && totalExpense > 0) {
      const percent = Math.round((categoryMap[maxCategory] / totalExpense) * 100);
      insights.push(`📊 ${percent}% of your expenses go to ${maxCategory}`);
    }

    // 🔥 Saving suggestion
    if (totalExpense > 0) {
      insights.push(`💡 Try reducing ${maxCategory} spending by 20% to save money`);
    }

    res.json({ insights });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};