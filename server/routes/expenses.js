const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
  } catch {
    res.status(500).json({ message: "Error creating expense" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const expenses = await Expense.find().populate("property");
  res.json(expenses);
});

module.exports = router;
