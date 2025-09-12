const express = require("express");
const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.json(property);
  } catch {
    res.status(500).json({ message: "Error creating property" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

module.exports = router;
