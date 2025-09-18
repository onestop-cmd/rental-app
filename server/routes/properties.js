import express from "express";
import Property from "../models/Property.js";

const router = express.Router();

// GET all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// POST new property
router.post("/", async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: "Failed to create property", error: err });
  }
});

export default router;
