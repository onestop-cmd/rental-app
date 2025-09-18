// routes/dashboard.js
import express from "express";
import Rent from "../models/Rent.js";
import Expense from "../models/Expense.js";
import BankDeposit from "../models/BankDeposit.js";
import Property from "../models/Property.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const properties = await Property.find();

    const stats = await Promise.all(
      properties.map(async (property) => {
        const propertyId = property._id;

        // Current month
        const currentRent = await Rent.aggregate([
          { $match: { property: propertyId, paidDate: { $gte: currentMonthStart } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const currentExpenses = await Expense.aggregate([
          { $match: { property: propertyId, date: { $gte: currentMonthStart } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const currentDeposits = await BankDeposit.aggregate([
          { $match: { property: propertyId, depositDate: { $gte: currentMonthStart } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Previous month
        const prevRent = await Rent.aggregate([
          {
            $match: {
              property: propertyId,
              paidDate: { $gte: previousMonthStart, $lte: previousMonthEnd },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const prevExpenses = await Expense.aggregate([
          {
            $match: {
              property: propertyId,
              date: { $gte: previousMonthStart, $lte: previousMonthEnd },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const prevDeposits = await BankDeposit.aggregate([
          {
            $match: {
              property: propertyId,
              depositDate: { $gte: previousMonthStart, $lte: previousMonthEnd },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        return {
          property: {
            id: property._id,
            name: property.name,
            address: property.address,
            units: property.units,
          },
          current: {
            rent: currentRent[0]?.total || 0,
            expenses: currentExpenses[0]?.total || 0,
            deposits: currentDeposits[0]?.total || 0,
          },
          previous: {
            rent: prevRent[0]?.total || 0,
            expenses: prevExpenses[0]?.total || 0,
            deposits: prevDeposits[0]?.total || 0,
          },
        };
      })
    );

    res.json(stats);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

export default router;
