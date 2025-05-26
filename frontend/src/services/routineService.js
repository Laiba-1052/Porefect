import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const routineService = {
  // Get all routines for a user
  async getUserRoutines(userId) {
    try {
      const response = await axios.get(`${API_URL}/routines/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new routine
  async createRoutine(routineData) {
    try {
      const response = await axios.post(`${API_URL}/routines`, routineData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a routine
  async updateRoutine(routineId, routineData) {
    try {
      const response = await axios.patch(`${API_URL}/routines/${routineId}`, routineData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a routine
  async deleteRoutine(routineId, userId) {
    try {
      const response = await axios.delete(`${API_URL}/routines/${routineId}`, {
        data: { userId } // Include userId in request body
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 