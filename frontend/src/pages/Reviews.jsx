import React, { useState, useEffect } from 'react';
import { Plus, Search, Star, ChevronDown, X, AlertTriangle } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { api } from '../utils/api';
import { dummyProducts, dummyIngredients } from '../data/dummyData';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Form states
  const [newReviewProduct, setNewReviewProduct] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  
  useEffect(() => {
    fetchReviews();
    setIngredients(dummyIngredients);
  }, []);

  const fetchReviews = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const fetchedReviews = await api.getReviews(query);
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = () => {
    fetchReviews(searchQuery);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const openAddReviewModal = () => {
    setNewReviewProduct('');
    setNewReviewRating(5);
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowAddReviewModal(true);
  };
  
  const closeAddReviewModal = () => {
    setShowAddReviewModal(false);
  };
  
  const openIngredientModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowIngredientModal(true);
  };
  
  const closeIngredientModal = () => {
    setShowIngredientModal(false);
  };
  
  const handleAddReview = async (e) => {
    e.preventDefault();
    
    try {
      const product = dummyProducts.find(p => p.id === newReviewProduct);
      
      const reviewData = {
        productId: newReviewProduct,
        rating: newReviewRating,
        title: newReviewTitle,
        comment: newReviewComment
      };
      
      const newReview = await api.createReview(reviewData);
      setReviews([newReview, ...reviews]);
      closeAddReviewModal();
      
      setToast({
        type: 'success',
        message: 'Review added successfully!'
      });
    } catch (err) {
      console.error('Error adding review:', err);
      setToast({
        type: 'error',
        message: 'Failed to add review. Please try again.'
      });
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    try {
      const updatedReview = await api.markReviewHelpful(reviewId);
      setReviews(reviews.map(review => 
        review._id === reviewId ? updatedReview : review
      ));
    } catch (err) {
      console.error('Error marking review as helpful:', err);
      setToast({
        type: 'error',
        message: 'Failed to mark review as helpful'
      });
    }
  };
  
  const getProductById = (productId) => {
    return dummyProducts.find(product => product.id === productId);
  };
  
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <p className="text-gray-800 font-medium mb-2">Error loading reviews</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="pb-12">
        <header className="flex items-center justify-between mb-8 mt-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Reviews & Ingredients
            </h1>
            <p className="text-gray-600">
              Product reviews and ingredient safety information
            </p>
          </div>
          <Button 
            variant="primary"
            icon={<Plus size={18} />}
            onClick={openAddReviewModal}
          >
            Write Review
          </Button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Search size={18} />
                  Search
                </Button>
              </div>
            </div>
            
            {reviews.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No reviews yet</h3>
                <p className="text-gray-500 mb-6">Be the first to review a product.</p>
                <Button 
                  variant="primary"
                  icon={<Plus size={18} />}
                  onClick={openAddReviewModal}
                >
                  Write Review
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => {
                  const product = getProductById(review.productId);
                  
                  return (
                    <Card 
                      key={review._id} 
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        {product?.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md mr-4 hidden sm:block"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="font-medium text-gray-800">{product?.name || 'Unknown Product'}</h3>
                              <p className="text-sm text-gray-500">{product?.brand || ''}</p>
                            </div>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm font-medium text-gray-600">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <h4 className="text-lg font-medium text-gray-800 mb-1">{review.title}</h4>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              By {review.username} • {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            <button 
                              className="text-sm text-lavender-600 hover:text-lavender-700 flex items-center"
                              onClick={() => handleHelpfulClick(review._id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              Helpful ({review.helpfulCount})
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          <div>
            <Card 
              title="Ingredient Safety Guide" 
              subtitle="Learn about common skincare ingredients"
            >
              <div className="space-y-3 mt-1">
                {ingredients.map((ingredient) => (
                  <button
                    key={ingredient.name}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-lavender-300 hover:bg-lavender-50 transition-colors"
                    onClick={() => openIngredientModal(ingredient)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">{ingredient.name}</h3>
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {ingredient.description}
                    </p>
                  </button>
                ))}
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                Note: This information is for educational purposes only. Always check with a dermatologist for personalized advice.
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Write a Review</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeAddReviewModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product">
                  Product
                </label>
                <select
                  id="product"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newReviewProduct}
                  onChange={(e) => setNewReviewProduct(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a product</option>
                  {dummyProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.brand})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setNewReviewRating(rating)}
                    >
                      <Star
                        size={24}
                        className={rating <= newReviewRating ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Review Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comment">
                  Review
                </label>
                <textarea
                  id="comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  rows="4"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeAddReviewModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Ingredient Modal */}
      {showIngredientModal && selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedIngredient.name}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeIngredientModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">What it is</h4>
                <p className="text-gray-600">
                  {selectedIngredient.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Benefits</h4>
                <p className="text-gray-600">
                  {selectedIngredient.benefits}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Safety Concerns</h4>
                <div className="flex items-start">
                  <AlertTriangle size={18} className="text-warning-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-600">
                    {selectedIngredient.concerns}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Found in</h4>
                <ul className="text-gray-600 space-y-1 pl-5 list-disc">
                  {selectedIngredient.products.map((product, index) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Reviews;