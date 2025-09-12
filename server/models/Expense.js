const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema);
