const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, authorize('student'), getStudentProfile).put(protect, authorize('student'), updateStudentProfile);

module.exports = router;