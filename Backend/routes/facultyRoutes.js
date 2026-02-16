const express = require('express');
const router = express.Router();
const { getFacultyProfile, updateFacultyProfile, updateFacultyPassword, getAllStudentsForFaculty, markAttendance, getFacultySubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get/Update faculty profile
// @route   GET/PUT /api/faculty/profile
// @access  Private (Faculty)
router
  .route('/profile')
  .get(protect, authorize('faculty'), getFacultyProfile)
  .put(protect, authorize('faculty'), updateFacultyProfile);

// @desc    Update faculty password
// @route   PUT /api/faculty/password
// @access  Private (Faculty)
router.route('/password').put(protect, authorize('faculty'), updateFacultyPassword);

// @desc    Get all students for faculty
// @route   GET /api/faculty/students
// @access  Private (Faculty)
router.route('/students').get(protect, authorize('faculty'), getAllStudentsForFaculty);

// @desc    Mark attendance for a student
// @route   POST /api/faculty/attendance
// @access  Private (Faculty)
router.route('/attendance').post(protect, authorize('faculty'), markAttendance);

// @desc    Get subjects taught by the faculty
// @route   GET /api/faculty/subjects
// @access  Private (Faculty)
router.route('/subjects')
  .get(protect, authorize('faculty'), getFacultySubjects)
  .post(protect, authorize('faculty'), createSubject);

// @desc    Update/Delete a subject
// @route   PUT/DELETE /api/faculty/subjects/:id
// @access  Private (Faculty)
router.route('/subjects/:id')
  .put(protect, authorize('faculty'), updateSubject)
  .delete(protect, authorize('faculty'), deleteSubject);

module.exports = router;