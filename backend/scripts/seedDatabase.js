require('dotenv').config();
const mongoose = require('mongoose');
const Routine = require('../models/Routine');
const Product = require('../models/Product');
const Task = require('../models/Task');
const Review = require('../models/Review');

const {
  dummyUser,
  dummyRoutines,
  dummyProducts,
  dummyTasks,
  dummyReviews,
} = require('../../frontend/src/data/dummyData');

const connectDB = require('../config/db');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Promise.all([
      Routine.deleteMany({}),
      Product.deleteMany({}),
      Task.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('Cleared existing data...');

    // Transform and insert routines
    const routines = dummyRoutines.map(routine => ({
      userId: routine.userId,
      name: routine.name,
      description: routine.description || '',
      products: routine.steps.map(step => ({
        name: step.name,
        notes: step.notes,
      })),
      schedule: routine.timeOfDay === 'morning' ? 'morning' :
                routine.timeOfDay === 'evening' ? 'evening' : 'both',
      isActive: true,
    }));
    await Routine.insertMany(routines);
    console.log('Routines seeded...');

    // Insert products
    const products = dummyProducts.map(product => ({
      ...product,
      purchaseDate: product.purchaseDate ? new Date(product.purchaseDate) : undefined,
      expiryDate: product.expiryDate ? new Date(product.expiryDate) : undefined,
      openedDate: product.openedDate ? new Date(product.openedDate) : undefined,
    }));
    await Product.insertMany(products);
    console.log('Products seeded...');

    // Insert tasks
    const tasks = dummyTasks.map(task => ({
      ...task,
      lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined,
    }));
    await Task.insertMany(tasks);
    console.log('Tasks seeded...');

    // Insert reviews
    const reviews = dummyReviews.map(review => ({
      ...review,
      createdAt: review.createdAt ? new Date(review.createdAt) : undefined,
    }));
    await Review.insertMany(reviews);
    console.log('Reviews seeded...');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 