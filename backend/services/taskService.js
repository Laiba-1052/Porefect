const Task = require('../models/Task');
const Routine = require('../models/Routine');

const taskService = {
  // Get all tasks for a user for a specific day
  async getUserTasksForDay(userId, date) {
    try {
      const dayOfWeek = new Date(date).getDay();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Get only tasks (not routines) that are scheduled for this day
      const tasks = await Task.find({
        userId,
        daysOfWeek: dayOfWeek
      }).sort({ time: 1 });

      // Map tasks to include completion status for the specific date
      const tasksWithCompletionStatus = tasks.map(task => {
        const taskObj = task.toObject();
        const completion = task.completions?.find(c => {
          const completionDate = new Date(c.date);
          return completionDate.toDateString() === startOfDay.toDateString();
        });
        
        return {
          ...taskObj,
          completed: completion ? completion.completed : false
        };
      });

      return tasksWithCompletionStatus;
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
        completions: [],
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

  // Mark a task as completed for a specific date
  async completeTask(taskId, userId, date) {
    try {
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      // Find if there's already a completion for this date
      const existingCompletionIndex = task.completions.findIndex(c => {
        const completionDate = new Date(c.date);
        return completionDate.toDateString() === startOfDay.toDateString();
      });

      if (existingCompletionIndex >= 0) {
        // Update existing completion
        task.completions[existingCompletionIndex].completed = true;
      } else {
        // Add new completion
        task.completions.push({
          date: startOfDay,
          completed: true
        });
      }

      task.lastCompleted = new Date();
      await task.save();

      return { message: 'Task completed' };
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Mark a task as uncompleted for a specific date
  async uncompleteTask(taskId, userId, date) {
    try {
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      // Find if there's already a completion for this date
      const existingCompletionIndex = task.completions.findIndex(c => {
        const completionDate = new Date(c.date);
        return completionDate.toDateString() === startOfDay.toDateString();
      });

      if (existingCompletionIndex >= 0) {
        // Update existing completion
        task.completions[existingCompletionIndex].completed = false;
      } else {
        // Add new completion
        task.completions.push({
          date: startOfDay,
          completed: false
        });
      }

      await task.save();

      return { message: 'Task uncompleted' };
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};

module.exports = taskService; 