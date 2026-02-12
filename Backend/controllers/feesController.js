const asyncHandler = require('express-async-handler');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @desc    Get student fees
// @route   GET /api/fees
// @access  Private (Student)
const getStudentFees = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const fees = await Fee.find({ studentId: student._id });

  res.json(fees);
});

module.exports = {
  getStudentFees,
};