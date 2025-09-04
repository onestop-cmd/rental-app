const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
module.exports = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
