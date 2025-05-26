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
      withCredentials: true,
      ...(data && { data }),
    };

    console.log(`Making ${method} request to ${endpoint}`, { config });

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', {
      endpoint,
      method,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    if (error.response?.status === 404) {
      throw new Error(`Resource not found: ${endpoint}`);
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in');
    } else if (error.response?.status === 403) {
      throw new Error('Forbidden: You do not have permission to access this resource');
    } else if (!error.response) {
      throw new Error('Network error: Please check your connection or try again later');
    }

    throw error.response?.data || error;
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

  // Dashboard
  getDashboard: (userId) => apiRequest('GET', `/dashboard/${userId}`),
  addSuggestedRoutine: (data) => apiRequest('POST', '/dashboard/add-suggested-routine', data),

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