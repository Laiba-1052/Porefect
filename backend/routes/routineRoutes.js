const express = require('express');
const router = express.Router();
const routineService = require('../services/routineService');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all routines for a user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    // Verify that the requesting user matches the userId parameter
    if (req.user.uid !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }

    const routines = await routineService.getUserRoutines(req.params.userId);
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new routine
router.post('/', verifyToken, async (req, res) => {
  try {
    // Use the authenticated user's ID
    const routineData = {
      ...req.body,
      userId: req.user.uid
    };
    const newRoutine = await routineService.createRoutine(routineData);
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a routine
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const updatedRoutine = await routineService.updateRoutine(
      req.params.id,
      req.user.uid,
      {
        ...req.body,
        userId: req.user.uid
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
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await routineService.deleteRoutine(req.params.id, req.user.uid);
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