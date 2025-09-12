const mongoose = require("mongoose");

const bankDepositSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  depositedBy: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  month: String, // YYYY-MM (for reconciliation)
});

module.exports = mongoose.model("BankDeposit", bankDepositSchema);
