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
    name: String,
    category: String,
    frequency: String,
    notes: String,
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('Routine', routineSchema); 