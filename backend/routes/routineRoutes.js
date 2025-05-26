const express = require('express');
const router = express.Router();
const routineService = require('../services/routineService');

// Get all routines for a user
router.get('/:userId', async (req, res) => {
  try {
    const routines = await routineService.getUserRoutines(req.params.userId);
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new routine
router.post('/', async (req, res) => {
  try {
    // For demo purposes, always use demo-user-123
    const routineData = {
      ...req.body,
      userId: 'demo-user-123'
    };
    const newRoutine = await routineService.createRoutine(routineData);
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a routine
router.patch('/:id', async (req, res) => {
  try {
    // For demo purposes, always use demo-user-123
    const updatedRoutine = await routineService.updateRoutine(
      req.params.id,
      'demo-user-123',
      {
        ...req.body,
        userId: 'demo-user-123'
      }
    );
    res.json(updatedRoutine);
  } catch (error) {
    if (error.message === 'Routine not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Delete a routine
router.delete('/:id', async (req, res) => {
  try {
    // For demo purposes, always use demo-user-123
    const result = await routineService.deleteRoutine(req.params.id, 'demo-user-123');
    res.json(result);
  } catch (error) {
    if (error.message === 'Routine not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router; 