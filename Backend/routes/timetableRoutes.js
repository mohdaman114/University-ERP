const express = require('express');
const router = express.Router();
const {
  getStudentTimetable,
  getFacultyTimetable,
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student route
router.get('/', protect, authorize('student'), getStudentTimetable);

// Faculty route
router.get('/faculty', protect, authorize('faculty'), getFacultyTimetable);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllTimetables);
router.post('/', protect, authorize('admin'), createTimetable);
router.put('/:id', protect, authorize('admin'), updateTimetable);
router.delete('/:id', protect, authorize('admin'), deleteTimetable);

module.exports = router;
