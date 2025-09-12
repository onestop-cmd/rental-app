const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  month: String, // YYYY-MM
  amount: Number,
  status: { type: String, enum: ["due", "paid"], default: "due" },
  paidAt: Date,
});

const tenantSchema = new mongoose.Schema({
  name: String,
  email: String,
  monthlyRent: Number,
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  payments: [paymentSchema],
});

module.exports = mongoose.model("Tenant", tenantSchema);
