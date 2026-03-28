const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  console.log(`[Login Attempt] User: ${email}, Role: ${role || 'N/A'}`);

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`[Login Failed] User not found for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if the provided role matches the user's role
  if (role && user.role !== role) {
    console.log(`[Login Failed] Role mismatch for user ${email}. Expected: ${role}, Actual: ${user.role}`);
    res.status(401);
    throw new Error(`Role mismatch. Please select the correct role (${user.role}).`);
  }

  if (await user.matchPassword(password)) {
    console.log(`[Login Success] User ${email} (${user.role}) logged in.`);
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
    console.log(`[Login Failed] Invalid password for user: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
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