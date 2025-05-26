const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Get all products for a user
router.get('/:userId', async (req, res) => {
  try {
    const products = await productService.getUserProducts(req.params.userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.patch('/:id', async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body.userId,
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id, req.body.userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router; 