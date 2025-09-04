const express = require('express');
const router = express.Router();
const RentSchedule = require('../models/RentSchedule');
const Expense = require('../models/Expense');
const BankDeposit = require('../models/BankDeposit');

router.get('/:month', async (req,res) => {
  const month = req.params.month; // format YYYY-MM
  const rents = await RentSchedule.find({ month }).populate('tenant');
  const expenses = await Expense.find({}).populate('property');
  const deposits = await BankDeposit.find({ depositMonth: month }).populate('property');
  const rentCollected = rents.filter(r=>r.status==='paid').reduce((s,r)=>s+(r.amount||0),0);
  const expenseTotal = expenses.reduce((s,e)=>s+(e.amount||0),0);
  const depositTotal = deposits.reduce((s,d)=>s+(d.amount||0),0);
  const net = rentCollected - expenseTotal;
  res.json({ month, rentCollected, expenseTotal, depositTotal, net, diff: depositTotal - rentCollected });
});

module.exports = router;
