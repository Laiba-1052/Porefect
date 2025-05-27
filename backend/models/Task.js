const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['routine', 'task'],
    required: true,
  },
  routineId: String,
  schedule: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: true,
  },
  time: String,
  daysOfWeek: [Number],
  completed: {
    type: Boolean,
    default: false,
  },
  lastCompleted: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema); 