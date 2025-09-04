const mongoose = require('mongoose');
const RentScheduleSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  month: String,
  amount: Number,
  status: { type: String, enum: ['paid','unpaid'], default: 'unpaid' },
  receipt: { url: String, uploadedAt: Date }
}, { timestamps: true });
module.exports = mongoose.model('RentSchedule', RentScheduleSchema);
