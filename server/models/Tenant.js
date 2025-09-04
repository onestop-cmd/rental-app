const mongoose = require('mongoose');
const TenantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  rent: Number,
  receipts: [{ url: String, uploadedAt: Date }]
}, { timestamps: true });
module.exports = mongoose.model('Tenant', TenantSchema);
