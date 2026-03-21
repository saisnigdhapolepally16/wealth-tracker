import Transaction from "../models/transaction.js";

// CREATE
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, notes } = req.body;

    // Basic validation
    if (!type || !amount || amount <= 0) {
      return res.status(400).json({ message: "Type and positive amount required" });
    }

    const newTransaction = new Transaction({
      userId: req.user,
      type,
      category,
      amount,
      notes,
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL
export const getTransactions = async (req, res) => {
  try {
    const { limit, type } = req.query;
    let query = { userId: req.user };

    if (type) {
      query.type = type;
    }

    let data = Transaction.find(query).sort({ date: -1 });

    if (limit) {
      data = data.limit(parseInt(limit));
    }

    data = await data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ONE
export const getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findOne({ _id: req.params.id, userId: req.user });

    if (!txn) return res.status(404).json({ message: "Not found" });

    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE
export const updateTransaction = async (req, res) => {
  try {
    const { type, category, amount, notes } = req.body;

    // Prevent updating userId or invalid data
    if (req.body.userId || (amount && amount <= 0)) {
      return res.status(400).json({ message: "Invalid update" });
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { type, category, amount, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user });

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};