const asyncHandler = require('express-async-handler');
const Result = require('../models/Result');
const Student = require('../models/Student');

// @desc    Get student results
// @route   GET /api/results
// @access  Private (Student)
const getStudentResults = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const results = await Result.find({ studentId: student._id });

  res.json(results);
});

module.exports = {
  getStudentResults,
};