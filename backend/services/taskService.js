const Task = require('../models/Task');
const Routine = require('../models/Routine');

const taskService = {
  // Get all tasks for a user for a specific day
  async getUserTasksForDay(userId, date) {
    try {
      const dayOfWeek = new Date(date).getDay();
      
      // Get tasks and routines that are scheduled for this day
      const tasks = await Task.find({
        userId,
        daysOfWeek: dayOfWeek
      }).sort({ time: 1 });

      // Get routines for this day
      const routines = await Routine.find({
        userId,
        isActive: true
      });

      // Convert routines to tasks
      const routineTasks = routines.map(routine => ({
        _id: `routine-${routine._id}`,
        userId: routine.userId,
        title: routine.name,
        type: 'routine',
        routineId: routine._id,
        schedule: routine.schedule,
        time: routine.preferredTime || '',
        daysOfWeek: routine.schedule === 'morning' ? [0,1,2,3,4,5,6] : 
                    routine.schedule === 'evening' ? [0,1,2,3,4,5,6] : 
                    routine.daysOfWeek || [dayOfWeek],
        completed: false,
        lastCompleted: routine.lastCompleted,
        steps: routine.steps,
        createdAt: routine.createdAt,
        updatedAt: routine.updatedAt
      }));

      // Combine and sort all tasks by time
      const allTasks = [...tasks, ...routineTasks].sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });

      return allTasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      // If it's a routine-based task, verify the routine exists
      if (taskData.type === 'routine' && taskData.routineId) {
        const routine = await Routine.findOne({
          _id: taskData.routineId,
          userId: taskData.userId
        });

        if (!routine) {
          throw new Error('Routine not found');
        }

        // Use routine name as task title if not provided
        if (!taskData.title) {
          taskData.title = routine.name;
        }
      }

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
      // Check if it's a routine task
      if (taskId.startsWith('routine-')) {
        const routineId = taskId.replace('routine-', '');
        const routine = await Routine.findOne({ _id: routineId, userId });
        
        if (!routine) {
          throw new Error('Routine not found');
        }

        routine.lastCompleted = new Date();
        await routine.save();
        return { message: 'Routine completed' };
      }

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
      // Check if it's a routine task
      if (taskId.startsWith('routine-')) {
        const routineId = taskId.replace('routine-', '');
        const routine = await Routine.findOne({ _id: routineId, userId });
        
        if (!routine) {
          throw new Error('Routine not found');
        }

        routine.lastCompleted = null;
        await routine.save();
        return { message: 'Routine uncompleted' };
      }

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