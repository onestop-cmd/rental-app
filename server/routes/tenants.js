const express = require("express");
const Tenant = require("../models/Tenant");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, monthlyRent, property } = req.body;
    const tenant = new Tenant({ name, email, monthlyRent, property, payments: [] });
    await tenant.save();
    res.json(tenant);
  } catch {
    res.status(500).json({ message: "Error creating tenant" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const tenants = await Tenant.find().populate("property");
  res.json(tenants);
});

module.exports = router;
