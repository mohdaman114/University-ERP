const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

module.exports = router;