// routes/properties.js
import express from "express";
import Property from "../models/Property.js";
import Tenant from "../models/Tenant.js";
import Rent from "../models/Rent.js";
import Expense from "../models/Expense.js";
import BankDeposit from "../models/BankDeposit.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET all properties
 * Accessible by all logged-in users
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Error fetching properties" });
  }
});

/**
 * POST create a new property
 * Accessible by all logged-in users
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, address, units } = req.body;
    const property = new Property({ name, address, units });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ message: "Error creating property" });
  }
});

/**
 * DELETE property
 * Admin only
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ message: "Error deleting property" });
  }
});

/**
 * GET property details (units, tenants, rents, expenses, deposits)
 * Accessible by all logged-in users
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const tenants = await Tenant.find({ property: propertyId });
    const rents = await Rent.find({ property: propertyId }).populate("tenant", "name");
    const expenses = await Expense.find({ property: propertyId });
    const deposits = await BankDeposit.find({ property: propertyId });

    res.json({
      property,
      tenants,
      rents,
      expenses,
      deposits,
    });
  } catch (err) {
    console.error("Error fetching property details:", err);
    res.status(500).json({ message: "Error fetching property details" });
  }
});

/**
 * POST add a unit to a property
 * Accessible by all logged-in users
 */
router.post("/:id/units", authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const { unitName } = req.body;
    property.units.push({ name: unitName });
    await property.save();

    res.status(201).json(property);
  } catch (err) {
    console.error("Error adding unit:", err);
    res.status(500).json({ message: "Error adding unit" });
  }
});

export default router;
