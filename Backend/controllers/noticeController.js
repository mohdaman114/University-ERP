const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private (Student)
const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find({}).sort({ date: -1 });
  res.json(notices);
});

module.exports = {
  getAllNotices,
};