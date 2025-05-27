const Task = require('../models/Task');
const Routine = require('../models/Routine');

const taskService = {
  // Get all tasks for a user for a specific day
  async getUserTasksForDay(userId, date) {
    try {
      const dayOfWeek = new Date(date).getDay();
      
      // Get only tasks (not routines) that are scheduled for this day
      const tasks = await Task.find({
        userId,
        daysOfWeek: dayOfWeek
      }).sort({ time: 1 });

      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      // Create and save the new task
      const task = new Task({
        ...taskData,
        completed: false,
        lastCompleted: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedTask = await task.save();
      return savedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Mark a task as completed
  async completeTask(taskId, userId) {
    try {
      // Regular task
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      task.completed = true;
      task.lastCompleted = new Date();
      await task.save();

      return { message: 'Task completed' };
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Mark a task as uncompleted
  async uncompleteTask(taskId, userId) {
    try {
      // Regular task
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      task.completed = false;
      task.lastCompleted = null;
      await task.save();

      return { message: 'Task uncompleted' };
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};

module.exports = taskService; 