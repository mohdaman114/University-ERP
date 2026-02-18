const express = require('express');
const router = express.Router();
const {
  getStudents,
  getSubjects,
  getStudentMarks,
  updateMarks
} = require('../controllers/examinerPortalController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);
router.use(authorize('examiner'));

// Student list
router.get('/students', getStudents);

// Subject list
router.get('/subjects', getSubjects);

// Marks update (POST because it handles create/update logic)
router.post('/marks', updateMarks);

// Get marks for a specific student and subject
router.get('/marks/:studentId/:subjectId', getStudentMarks);

module.exports = router;
