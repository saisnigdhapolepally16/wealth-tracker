import Income from "../models/income.js";

// CREATE
export const createIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;

    if (!source || !amount || amount <= 0) {
      return res.status(400).json({ message: "Source and positive amount required" });
    }

    const income = await Income.create({
      userId: req.user, // Fixed: was req.user.id
      source,
      amount,
      date,
      notes,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user }).sort({ date: -1 }); // Fixed: was req.user.id
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;

    if (amount && amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user }, // Fixed: was req.user.id
      { source, amount, date, notes },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user, // Fixed: was req.user.id
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};