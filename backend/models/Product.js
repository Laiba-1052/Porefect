const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: String,
  category: String,
  purchaseDate: Date,
  expiryDate: Date,
  openedDate: Date,
  periodAfterOpening: Number,
  price: Number,
  size: String,
  ingredients: String,
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  imageUrl: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema); 