import express from "express";
import Rent from "../models/Rent.js";
import Expense from "../models/Expense.js";
import Deposit from "../models/Deposit.js";

const router = express.Router();

function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const { start: startCurrent, end: endCurrent } = getMonthRange(now);
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { start: startPrev, end: endPrev } = getMonthRange(prevMonth);

    // Current month
    const rentCurrent = await Rent.aggregate([
      { $match: { paidDate: { $gte: startCurrent, $lte: endCurrent } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expensesCurrent = await Expense.aggregate([
      { $match: { date: { $gte: startCurrent, $lte: endCurrent } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const depositsCurrent = await Deposit.aggregate([
      { $match: { date: { $gte: startCurrent, $lte: endCurrent } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Previous month
    const rentPrev = await Rent.aggregate([
      { $match: { paidDate: { $gte: startPrev, $lte: endPrev } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expensesPrev = await Expense.aggregate([
      { $match: { date: { $gte: startPrev, $lte: endPrev } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const depositsPrev = await Deposit.aggregate([
      { $match: { date: { $gte: startPrev, $lte: endPrev } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      currentMonth: {
        rent: rentCurrent[0]?.total || 0,
        expenses: expensesCurrent[0]?.total || 0,
        deposits: depositsCurrent[0]?.total || 0,
      },
      previousMonth: {
        rent: rentPrev[0]?.total || 0,
        expenses: expensesPrev[0]?.total || 0,
        deposits: depositsPrev[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

export default router;
