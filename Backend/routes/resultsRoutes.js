const express = require('express');
const router = express.Router();
const { getStudentResults } = require('../controllers/resultsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student'), getStudentResults);

module.exports = router;