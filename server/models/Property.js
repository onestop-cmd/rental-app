// models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  units: [{ type: String }], // multiple unit names (e.g., "Unit A", "Unit B")
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Property", PropertySchema);

