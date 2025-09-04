const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
router.post('/register', async (req,res) => {
  try {
    const { name,email,password } = req.body;
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ msg: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role: 'user' });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('Registered user', email);
    res.json({ token, user: { id: user._id, name, email, role: user.role }});
  } catch (err) {
    console.error('Register error', err.message);
    res.status(500).send('Server error');
  }
});

// login
router.post('/login', async (req,res) => {
  try {
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ msg: 'Invalid' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('Login', email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    console.error('Login error', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
