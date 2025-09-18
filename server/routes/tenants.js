import express from "express";
import Tenant from "../models/Tenant.js";
import Rent from "../models/Rent.js";

const router = express.Router();

// GET overdue tenants
router.get("/overdue", async (req, res) => {
  try {
    const today = new Date();

    // Find unpaid rents due before today
    const overdueRents = await Rent.find({
      dueDate: { $lt: today },
      paid: false,
    }).populate("tenant property");

    const tenants = overdueRents.map((r) => ({
      _id: r.tenant._id,
      name: r.tenant.name,
      unit: r.tenant.unit,
      property: r.property?.builderName || "Unknown",
      rentDue: r.amount,
      rentId: r._id,
    }));

    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overdue tenants" });
  }
});

export default router;
