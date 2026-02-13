const express = require('express');
const router = express.Router();
const { getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get student attendance
// @route   GET /api/attendance
// @access  Private (Student)
router.get('/', protect, authorize('student'), getStudentAttendance);

module.exports = router;