// routes/properties.js
import express from "express";
import Property from "../models/Property.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET all properties (any logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find().populate("createdBy", "name email");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching properties" });
  }
});

// POST create new property (any logged-in user)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, address, units } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    const property = new Property({
      name,
      address,
      units: units || [], // array of unit names
      createdBy: req.user.id,
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error("Error adding property:", err);
    res.status(500).json({ message: "Error creating property" });
  }
});

// DELETE property (only admin can delete)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting property" });
  }
});

export default router;
