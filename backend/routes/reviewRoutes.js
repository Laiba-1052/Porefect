const express = require('express');
const router = express.Router();
const reviewService = require('../services/reviewService');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await reviewService.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    // For demo purposes, always use demo-user-123
    const reviewData = {
      ...req.body,
      userId: 'demo-user-123',
      username: 'Sarah' // Using the demo username
    };
    const newReview = await reviewService.createReview(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Increment helpful count
router.post('/:id/helpful', async (req, res) => {
  try {
    const updatedReview = await reviewService.incrementHelpfulCount(req.params.id);
    res.json(updatedReview);
  } catch (error) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router; 