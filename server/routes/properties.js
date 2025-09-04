const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, async (req,res) => {
  const items = await Property.find();
  res.json(items);
});

router.post('/', auth, role(['admin']), async (req,res)=> {
  const p = new Property(req.body);
  await p.save();
  console.log('Property created', p._id);
  res.json(p);
});

module.exports = router;
