const express = require('express');
const router = express.Router();

// Public routes that don't require authentication
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router; 