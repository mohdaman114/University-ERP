const express = require('express');
const router = express.Router();
const { getAllNotices } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student', 'faculty'), getAllNotices);

module.exports = router;