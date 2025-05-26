import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const taskService = {
  // Get tasks for a specific day
  async getTasksForDay(userId, date) {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/tasks/${userId}/${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Mark task as completed
  async completeTask(taskId, userId) {
    try {
      const response = await axios.post(`${API_URL}/tasks/${taskId}/complete`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Mark task as uncompleted
  async uncompleteTask(taskId, userId) {
    try {
      const response = await axios.post(`${API_URL}/tasks/${taskId}/uncomplete`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};

export default taskService; 