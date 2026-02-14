import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  amountRWF: {
    type: Number,
    required: true
  },
  kwhAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    default: null
  },
  tokenNumber: {
    type: String,
    required: true
  },
  rechargeCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'COMPLETED'
  },
  tokenApplied: {
    type: Boolean,
    default: false
  },
  tokenAppliedAt: {
    type: Date,
    default: null
  },
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
