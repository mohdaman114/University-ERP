const express = require('express');
const router = express.Router();
const { getStudentTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student'), getStudentTimetable);

module.exports = router;