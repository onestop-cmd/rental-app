const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer().single('receipt');
const { uploadBuffer } = require('../utils/googleDrive');

router.get('/', auth, async (req,res)=> {
  const tenants = await Tenant.find().populate('property');
  res.json(tenants);
});

router.post('/', auth, async (req,res)=> {
  const t = new Tenant(req.body);
  await t.save();
  console.log('Tenant added', t._id);
  res.json(t);
});

// optional receipt upload
router.post('/:id/receipt', auth, upload, async (req,res) => {
  try {
    if(!req.file) return res.status(400).send('No file');
    const uploaded = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
    const tenant = await Tenant.findById(req.params.id);
    tenant.receipts.push({ url: uploaded ? uploaded.id : 'local-skip', uploadedAt: new Date() });
    await tenant.save();
    res.json(tenant);
  } catch (err) {
    console.error('Receipt upload', err.message);
    res.status(500).send('Error');
  }
});

module.exports = router;
