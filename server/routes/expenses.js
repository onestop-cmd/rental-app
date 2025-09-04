const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=> {
  const list = await Expense.find().populate('property createdBy');
  res.json(list);
});

router.post('/', auth, async (req,res)=> {
  const e = new Expense({...req.body, createdBy: req.user._id});
  await e.save();
  console.log('Expense', e._id);
  res.json(e);
});

module.exports = router;
