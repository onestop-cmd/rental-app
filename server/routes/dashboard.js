const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Expense = require('../models/Expense');
const BankDeposit = require('../models/BankDeposit');

router.get('/', async (req,res)=> {
  const props = await Property.countDocuments();
  const tenants = await Tenant.countDocuments();
  const expenses = await Expense.countDocuments();
  const deposits = await BankDeposit.countDocuments();
  res.json({ properties: props, tenants, expenses, deposits });
});

module.exports = router;
