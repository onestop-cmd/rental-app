const express = require("express");
const BankDeposit = require("../models/BankDeposit");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const deposit = new BankDeposit(req.body);
    await deposit.save();
    res.json(deposit);
  } catch {
    res.status(500).json({ message: "Error creating deposit" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const deposits = await BankDeposit.find().populate("property");
  res.json(deposits);
});

module.exports = router;
