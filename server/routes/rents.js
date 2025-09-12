const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Tenant = require("../models/Tenant");

router.post("/:tenantId/mark-paid", authMiddleware, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await Tenant.findById(tenantId).populate("property");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const overduePayment = tenant.payments.find((p) => p.status === "due");
    if (!overduePayment) return res.status(400).json({ message: "No overdue payments" });

    overduePayment.status = "paid";
    overduePayment.paidAt = new Date();
    await tenant.save();

    res.json({ message: "Payment marked as paid", tenant });
  } catch {
    res.status(500).json({ message: "Error marking payment" });
  }
});

module.exports = router;
