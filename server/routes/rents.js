const express = require('express');
const router = express.Router();
const RentSchedule = require('../models/RentSchedule');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer().single('receipt');
const { uploadBuffer } = require('../utils/googleDrive');

router.get('/', auth, async (req,res)=> {
  const r = await RentSchedule.find().populate('tenant');
  res.json(r);
});

router.post('/', auth, async (req,res)=> {
  const r = new RentSchedule(req.body);
  await r.save();
  console.log('Rent schedule created', r._id);
  res.json(r);
});

router.put('/:id/mark-paid', auth, upload, async (req,res)=> {
  const rent = await RentSchedule.findById(req.params.id);
  if(!rent) return res.status(404).send('Not found');
  rent.status = 'paid';
  if(req.file){
    const uploaded = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
    rent.receipt = { url: uploaded ? uploaded.id : 'local-skip', uploadedAt: new Date() };
  }
  await rent.save();
  console.log('Marked paid', rent._id);
  res.json(rent);
});

module.exports = router;
