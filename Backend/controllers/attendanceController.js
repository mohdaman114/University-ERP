const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get student attendance
// @route   GET /api/attendance
// @access  Private (Student)
const getStudentAttendance = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const attendance = await Attendance.find({ studentId: student._id }).populate('markedBy', 'name');

  res.json(attendance);
});

module.exports = {
  getStudentAttendance,
};