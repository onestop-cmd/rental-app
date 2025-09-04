const express = require('express');
const router = express.Router();
const BankDeposit = require('../models/BankDeposit');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=> {
  const q = {};
  if(req.query.property) q.property = req.query.property;
  if(req.query.month) q.depositMonth = req.query.month;
  const list = await BankDeposit.find(q).populate('property depositedBy');
  res.json(list);
});

router.post('/', auth, async (req,res)=> {
  const d = new BankDeposit(req.body);
  await d.save();
  console.log('Bank deposit', d._id);
  res.json(d);
});

module.exports = router;
