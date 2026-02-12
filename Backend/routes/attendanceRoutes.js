const express = require('express');
const router = express.Router();
const { getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student'), getStudentAttendance);

module.exports = router;