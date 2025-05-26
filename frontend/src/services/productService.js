import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const productService = {
  // Get all products for a user
  async getUserProducts(userId) {
    try {
      const response = await axios.get(`${API_URL}/products/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new product
  async createProduct(productData) {
    try {
      const response = await axios.post(`${API_URL}/products`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a product
  async updateProduct(productId, productData) {
    try {
      const response = await axios.patch(`${API_URL}/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a product
  async deleteProduct(productId, userId) {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}`, {
        data: { userId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 