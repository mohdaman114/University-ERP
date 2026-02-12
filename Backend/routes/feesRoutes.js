const express = require('express');
const router = express.Router();
const { getStudentFees } = require('../controllers/feesController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student'), getStudentFees);

module.exports = router;