const express = require("express");
const Property = require("../models/Property");
const Tenant = require("../models/Tenant");
const Expense = require("../models/Expense");
const Rent = require("../models/Rent");
const router = express.Router();

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    const tenants = await Tenant.find().populate("property");
    const expenses = await Expense.find();
    const rents = await Rent.find()
      .populate("tenant")
      .sort({ month: 1 }) // sort by upcoming months
      .limit(5);

    res.json({
      properties,
      tenants,
      expenses,
      rents,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

module.exports = router;
