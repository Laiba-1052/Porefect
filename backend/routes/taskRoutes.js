const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

// Get tasks for a specific day
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const tasks = await taskService.getUserTasksForDay(userId, date);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark task as completed
router.post('/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
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

// Mark task as uncompleted
router.post('/:taskId/uncomplete', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const result = await taskService.uncompleteTask(taskId, userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Task not found' || error.message === 'Routine not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router; 