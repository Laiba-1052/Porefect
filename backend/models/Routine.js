const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    // This will store the Firebase Auth UID
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: ''
    },
    frequency: {
      type: String,
      default: 'daily'
    },
    notes: {
      type: String,
      default: ''
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  }],
  schedule: {
    type: String,
    enum: ['morning', 'evening', 'both'],
    default: 'both',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastCompleted: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Routine', routineSchema); 