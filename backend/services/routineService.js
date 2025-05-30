const Routine = require('../models/Routine');

const routineService = {
  // Get all routines for a user
  async getUserRoutines(userId) {
    try {
      console.log('Getting routines for user:', userId);
      const routines = await Routine.find({ userId }).sort({ createdAt: -1 });
      console.log('Found routines:', routines);
      return routines;
    } catch (error) {
      console.error('Error getting routines:', error);
      throw error;
    }
  },

  // Create a new routine
  async createRoutine(routineData) {
    try {
      console.log('Creating routine with data:', routineData);
      const routine = new Routine(routineData);
      const savedRoutine = await routine.save();
      console.log('Created routine:', savedRoutine);
      return savedRoutine;
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  },

  // Update a routine
  async updateRoutine(routineId, userId, routineData) {
    try {
      console.log('Updating routine:', routineId, 'with data:', routineData);
      const routine = await Routine.findById(routineId);
      
      if (!routine) {
        console.error('Routine not found:', routineId);
        throw new Error('Routine not found');
      }
      
      // For demo purposes, skip the authorization check if it's the demo user
      if (userId !== 'demo-user-123' && routine.userId !== userId) {
        console.error('Not authorized. User:', userId, 'Routine owner:', routine.userId);
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
        console.log('Updating products array:', routineData.products);
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
      console.log('Updated routine:', updatedRoutine);
      return updatedRoutine;
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  },

  // Delete a routine
  async deleteRoutine(routineId, userId) {
    try {
      console.log('Deleting routine:', routineId);
      const routine = await Routine.findById(routineId);
      
      if (!routine) {
        console.error('Routine not found:', routineId);
        throw new Error('Routine not found');
      }
      
      // For demo purposes, skip the authorization check if it's the demo user
      if (userId !== 'demo-user-123' && routine.userId !== userId) {
        console.error('Not authorized. User:', userId, 'Routine owner:', routine.userId);
        throw new Error('Not authorized');
      }

      await routine.deleteOne();
      console.log('Routine deleted successfully');
      return { message: 'Routine deleted' };
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  }
};

module.exports = routineService; 