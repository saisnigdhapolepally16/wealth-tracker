import Goal from "../models/Goals.js";

// CREATE
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ message: "Target amount must be positive" });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    const goal = await Goal.create({
      userId: req.user,
      title,
      targetAmount,
      deadline,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateGoal = async (req, res) => {
  try {
    const { savedAmount } = req.body;

    if (savedAmount && savedAmount < 0) {
      return res.status(400).json({ message: "Saved amount cannot be negative" });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { savedAmount },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};