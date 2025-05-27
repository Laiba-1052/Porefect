import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const productService = {
  // Get all products for a user
  async getUserProducts(userId) {
    try {
      const response = await axios.get(`${API_URL}/products/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};

export default productService; 