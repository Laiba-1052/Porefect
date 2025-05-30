const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const { verifyToken } = require('../middleware/authMiddleware');

// Get tasks for a specific date - Protected route
router.get('/:userId/:date', verifyToken, async (req, res) => {
  try {
    const { userId, date } = req.params;
    
    // Verify that the requesting user matches the userId parameter
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }

    const tasks = await taskService.getUserTasksForDay(userId, date);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new task - Protected route
router.post('/', verifyToken, async (req, res) => {
  try {
    const taskData = req.body;
    
    // Verify that the requesting user matches the task's userId
    if (req.user.uid !== taskData.userId) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }

    const newTask = await taskService.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.message === 'Routine not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Mark task as completed - Protected route
router.post('/:taskId/complete', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    
    // Verify that the requesting user matches the userId parameter
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }

    const result = await taskService.completeTask(taskId, userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Task not found' || error.message === 'Routine not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Mark task as uncompleted - Protected route
router.post('/:taskId/uncomplete', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    
    // Verify that the requesting user matches the userId parameter
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }

    const result = await taskService.uncompleteTask(taskId, userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Task not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router; 