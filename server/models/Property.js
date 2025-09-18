import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    builderName: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    unitNumber: { type: String, required: false },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
