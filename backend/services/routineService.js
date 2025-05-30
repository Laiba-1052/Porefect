const Routine = require('../models/Routine');

const routineService = {
  // Get all routines for a user
  async getUserRoutines(userId) {
    try {
      const routines = await Routine.find({ userId }).sort({ createdAt: -1 });
      return routines;
    } catch (error) {
      console.error('Error getting routines:', error);
      throw error;
    }
  },

  // Create a new routine
  async createRoutine(routineData) {
    try {
      const routine = new Routine(routineData);
      const savedRoutine = await routine.save();
      return savedRoutine;
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  },

  // Update a routine
  async updateRoutine(routineId, userId, routineData) {
    try {
      const routine = await Routine.findById(routineId);
      
      if (!routine) {
        throw new Error('Routine not found');
      }
      
      if (routine.userId !== userId) {
        throw new Error('Not authorized');
      }

      // Update only the fields that are provided
      if (routineData.name) routine.name = routineData.name;
      if (routineData.description) routine.description = routineData.description;
      if (routineData.schedule) routine.schedule = routineData.schedule;
      if (routineData.isActive !== undefined) routine.isActive = routineData.isActive;
      if (routineData.lastCompleted) routine.lastCompleted = routineData.lastCompleted;
      
      // Handle products array update
      if (routineData.products) {
        // Ensure each product has the required fields
        routine.products = routineData.products.map(product => ({
          name: product.name,
          category: product.category || '',
          frequency: product.frequency || 'daily',
          notes: product.notes || '',
          productId: product.productId || null
        }));
      }

      const updatedRoutine = await routine.save();
      return updatedRoutine;
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  },

  // Delete a routine
  async deleteRoutine(routineId, userId) {
    try {
      const routine = await Routine.findById(routineId);
      
      if (!routine) {
        throw new Error('Routine not found');
      }
      
      if (routine.userId !== userId) {
        throw new Error('Not authorized');
      }

      await routine.deleteOne();
      return { message: 'Routine deleted' };
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  }
};

module.exports = routineService; 