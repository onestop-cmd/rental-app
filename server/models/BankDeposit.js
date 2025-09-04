const mongoose = require('mongoose');
const BankDepositSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  depositedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  depositDate: Date,
  depositMonth: String,
  amount: Number,
  description: String
}, { timestamps: true });
module.exports = mongoose.model('BankDeposit', BankDepositSchema);
