const Routine = require('../models/Routine');

const routineService = {
  // Get all routines for a user
  async getUserRoutines(userId) {
    try {
      return await Routine.find({ userId });
    } catch (error) {
      throw error;
    }
  },

  // Create a new routine
  async createRoutine(routineData) {
    try {
      const routine = new Routine(routineData);
      return await routine.save();
    } catch (error) {
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

      Object.keys(routineData).forEach(key => {
        if (key !== 'userId') {
          routine[key] = routineData[key];
        }
      });

      return await routine.save();
    } catch (error) {
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
      throw error;
    }
  }
};

module.exports = routineService; 