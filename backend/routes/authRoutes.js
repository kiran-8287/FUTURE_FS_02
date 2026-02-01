// Authentication routes
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * POST /api/auth/login
 * Admin login endpoint
 * Public route - no authentication required
 */
router.post('/login', login);

module.exports = router;
