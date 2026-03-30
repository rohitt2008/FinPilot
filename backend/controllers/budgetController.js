import Budget from "../models/Budget.js";

export const setBudget = async (req, res) => {
  const { amount, month } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, month },
    { amount },
    { upsert: true, new: true }
  );

  res.json(budget);
};