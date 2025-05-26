const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes that require authentication
router.get('/profile', verifyToken, (req, res) => {
  // req.user contains the decoded Firebase user token
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

module.exports = router; 