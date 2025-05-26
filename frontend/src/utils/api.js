import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://localhost:5000/api';

// Helper function to get Firebase token
const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Generic API request function
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      ...(data && { data }),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// API endpoints
export const api = {
  // Routines
  getRoutines: (userId) => apiRequest('GET', `/routines/${userId}`),
  createRoutine: (data) => apiRequest('POST', '/routines', data),
  updateRoutine: (id, data) => apiRequest('PATCH', `/routines/${id}`, data),
  deleteRoutine: (id, userId) => apiRequest('DELETE', `/routines/${id}`, { userId }),

  // Products
  getProducts: (userId) => apiRequest('GET', `/products/${userId}`),
  createProduct: (data) => apiRequest('POST', '/products', data),
  updateProduct: (id, data) => apiRequest('PATCH', `/products/${id}`, data),
  deleteProduct: (id, userId) => apiRequest('DELETE', `/products/${id}`, { userId }),

  // Tasks
  getTasks: (userId) => apiRequest('GET', `/tasks/${userId}`),
  createTask: (data) => apiRequest('POST', '/tasks', data),
  updateTask: (id, data) => apiRequest('PATCH', `/tasks/${id}`, data),
  deleteTask: (id, userId) => apiRequest('DELETE', `/tasks/${id}`, { userId }),

  // Reviews
  getReviews: (productId) => apiRequest('GET', `/reviews/${productId}`),
  createReview: (data) => apiRequest('POST', '/reviews', data),
  updateReview: (id, data) => apiRequest('PATCH', `/reviews/${id}`, data),
  deleteReview: (id, userId) => apiRequest('DELETE', `/reviews/${id}`, { userId }),
}; 