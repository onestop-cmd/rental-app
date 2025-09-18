import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    unit: { type: String },
    monthlyRent: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);
