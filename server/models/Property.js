const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
  builderName: String,
  buildingNumber: String,
  unitNumber: String,
  address: String
}, { timestamps: true });
module.exports = mongoose.model('Property', PropertySchema);
