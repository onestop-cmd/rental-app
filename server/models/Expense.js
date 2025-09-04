const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Expense', ExpenseSchema);
