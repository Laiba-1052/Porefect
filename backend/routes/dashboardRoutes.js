const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const Product = require('../models/Product');

// Get dashboard data
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get routines
    const routines = await Routine.find({ userId })
      .sort({ createdAt: -1 });

    // Get products
    const products = await Product.find({ userId })
      .sort({ createdAt: -1 });

    // Get completed routines count
    const completedRoutines = routines.filter(routine => routine.lastCompleted).length;

    // Get recent activities
    const activities = [];
    
    // Add routine completions to activities
    routines.forEach(routine => {
      if (routine.lastCompleted) {
        activities.push({
          id: `routine-${routine._id}`,
          type: 'routine_completed',
          routineId: routine._id,
          routineName: routine.name,
          timestamp: routine.lastCompleted,
          userId
        });
      }
    });

    // Add product additions to activities
    products.forEach(product => {
      activities.push({
        id: `product-${product._id}`,
        type: 'product_added',
        productId: product._id,
        productName: product.name,
        timestamp: product.createdAt,
        userId
      });
    });

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Get upcoming tasks (routines that need to be done)
    const upcomingTasks = routines
      .filter(routine => routine.isActive)
      .map(routine => ({
        id: routine._id,
        title: routine.name,
        type: 'routine',
        routineId: routine._id,
        schedule: routine.schedule,
        completed: false,
        lastCompleted: routine.lastCompleted
      }))
      .slice(0, 3);

    res.json({
      routinesCount: routines.length,
      productsCount: products.length,
      tasksCount: upcomingTasks.length,
      completedCount: completedRoutines,
      activities: activities.slice(0, 5),
      upcomingTasks
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add suggested routine to user's routines
router.post('/add-suggested-routine', async (req, res) => {
  try {
    const { userId, routineName, steps } = req.body;

    const newRoutine = new Routine({
      userId,
      name: routineName,
      description: `Added from suggested ${routineName} routine`,
      products: steps.map(step => ({
        name: step.name,
        notes: step.description,
        frequency: 'daily'
      })),
      schedule: routineName.toLowerCase().includes('morning') ? 'morning' : 
                routineName.toLowerCase().includes('evening') ? 'evening' : 'both',
      isActive: true
    });

    const savedRoutine = await newRoutine.save();
    res.status(201).json(savedRoutine);
  } catch (error) {
    console.error('Add suggested routine error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 