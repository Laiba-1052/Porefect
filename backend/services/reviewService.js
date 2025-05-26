const Review = require('../models/Review');

const reviewService = {
  // Get all reviews
  async getReviews(searchQuery = '') {
    try {
      console.log('Getting reviews with search query:', searchQuery);
      let query = {};
      
      if (searchQuery) {
        query = {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { comment: { $regex: searchQuery, $options: 'i' } }
          ]
        };
      }
      
      const reviews = await Review.find(query).sort({ createdAt: -1 });
      console.log('Found reviews:', reviews);
      return reviews;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  },

  // Create a new review
  async createReview(reviewData) {
    try {
      console.log('Creating review with data:', reviewData);
      const review = new Review(reviewData);
      const savedReview = await review.save();
      console.log('Created review:', savedReview);
      return savedReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Update helpful count
  async incrementHelpfulCount(reviewId) {
    try {
      console.log('Incrementing helpful count for review:', reviewId);
      const review = await Review.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }

      review.helpfulCount += 1;
      const updatedReview = await review.save();
      
      console.log('Updated review helpful count:', updatedReview);
      return updatedReview;
    } catch (error) {
      console.error('Error updating helpful count:', error);
      throw error;
    }
  }
};

module.exports = reviewService; 