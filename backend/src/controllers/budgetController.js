import Budget from "../models/Budget.js";

// CREATE
export const createBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    if (!category || !limit || !month || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (limit <= 0) {
      return res.status(400).json({ message: "Limit must be positive" });
    }

    const budget = await Budget.create({
      userId: req.user,
      category,
      limit,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY MONTH
export const getBudgetByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const budgets = await Budget.find({
      userId: req.user,
      month: parseInt(month),
      year: parseInt(year),
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateBudget = async (req, res) => {
  try {
    const { limit } = req.body;

    if (limit && limit <= 0) {
      return res.status(400).json({ message: "Limit must be positive" });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { limit },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};