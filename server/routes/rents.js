import express from "express";
import Rent from "../models/Rent.js";

const router = express.Router();

// PUT mark rent as paid
router.put("/:id/mark-paid", async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    rent.paid = true;
    rent.paidDate = new Date();
    await rent.save();

    res.json({ message: "Rent marked as paid", rent });
  } catch (err) {
    res.status(500).json({ message: "Failed to update rent" });
  }
});

export default router;
