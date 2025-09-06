const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your JWT middleware

const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Expense = require('../models/Expense');
const BankDeposit = require('../models/BankDeposit');

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const properties = await Property.find({}).lean();
    const tenants = await Tenant.find({}).populate('property').lean();
    const expenses = await Expense.find({}).populate('property').lean();
    const deposits = await BankDeposit.find({}).populate('property').lean();

    res.json({ properties, tenants, expenses, deposits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
