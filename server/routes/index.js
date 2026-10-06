const express = require('express');
const router = express.Router();

// Health check / welcome route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Ordering System API is running',
    version: '1.0.0',
  });
});

// Example of a future route group (we will add real ones later)
// router.use('/auth', require('./authRoutes'));
// router.use('/menu', require('./menuRoutes'));
// router.use('/orders', require('./orderRoutes'));

module.exports = router;