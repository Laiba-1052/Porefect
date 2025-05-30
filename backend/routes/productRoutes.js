const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Get all products (no userId filter)
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products for a user
router.get('/:userId', async (req, res) => {
  try {
    const products = await productService.getUserProducts(req.params.userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 