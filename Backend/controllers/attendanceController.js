const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Import mongoose
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course'); // Import Course model

// @desc    Get student attendance
// @route   GET /api/attendance
// @access  Private (Student)
const getStudentAttendance = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const attendanceRecords = await Attendance.find({ studentId: student._id }).populate('markedBy', 'name');

  // Process attendance records to ensure subject names are displayed
  const processedAttendance = await Promise.all(attendanceRecords.map(async (record) => {
    const recordObj = record.toObject(); // Convert Mongoose document to plain object
    // Check if the subject looks like an ObjectId (meaning it's an old record storing ID)
    if (mongoose.Types.ObjectId.isValid(recordObj.subject)) {
      const course = await Course.findById(recordObj.subject);
      if (course) {
        recordObj.subject = course.name; // Replace ID with name
      } else {
        recordObj.subject = 'Unknown Subject'; // Fallback if course not found
      }
    }
    return recordObj;
  }));

  res.json(processedAttendance);
});

module.exports = {
  getStudentAttendance,
};