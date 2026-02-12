const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  console.log('➡️ Student Login Route Hit');
  const { email, password, role } = req.body;
  console.log('Login attempt with:', { email, password, role });

  // Check for user email
  const user = await User.findOne({ email });
  console.log('User found:', user ? user.email : 'None');

  if (user && (await user.matchPassword(password))) {
    // Check if the provided role matches the user's role
    if (role && user.role !== role) {
      res.status(401);
      throw new Error('Role mismatch. Please select the correct role.');
    }
    console.log('Password matched for user:', user.email);
    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = {
  loginUser,
};

// User registration will be handled by admin module in future