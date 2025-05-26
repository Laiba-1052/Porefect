const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');

// Get all routines for a user
router.get('/:userId', async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.params.userId });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new routine
router.post('/', async (req, res) => {
  const routine = new Routine({
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
    products: req.body.products,
    schedule: req.body.schedule,
  });

  try {
    const newRoutine = await routine.save();
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a routine
router.patch('/:id', async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Only allow updating if the user owns the routine
    if (routine.userId !== req.body.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'userId') { // Prevent userId from being updated
        routine[key] = req.body[key];
      }
    });

    const updatedRoutine = await routine.save();
    res.json(updatedRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a routine
router.delete('/:id', async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Only allow deletion if the user owns the routine
    if (routine.userId !== req.body.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await routine.deleteOne();
    res.json({ message: 'Routine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 