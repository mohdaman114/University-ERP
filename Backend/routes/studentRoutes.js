const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile, updateStudentPassword } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get/Update student profile
// @route   GET/PUT /api/students/profile
// @access  Private (Student)
router
  .route('/profile')
  .get(protect, authorize('student'), getStudentProfile)
  .put(protect, authorize('student'), updateStudentProfile);

router.route('/password').put(protect, authorize('student'), updateStudentPassword);

module.exports = router;