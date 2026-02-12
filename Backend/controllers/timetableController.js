const asyncHandler = require('express-async-handler');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');

// @desc    Get student timetable
// @route   GET /api/timetable
// @access  Private (Student)
const getStudentTimetable = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const timetable = await Timetable.find({ course: student.course, semester: student.semester });

  res.json(timetable);
});

module.exports = {
  getStudentTimetable,
};