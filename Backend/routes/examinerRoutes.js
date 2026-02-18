const express = require('express');
const router = express.Router();
const {
  getAllExaminers,
  getExaminerById,
  createExaminer,
  updateExaminer,
  deleteExaminer,
} = require('../controllers/examinerController'); // Will create this controller next
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all examiner routes with admin authorization
router.use(protect);
router.use(authorize('admin'));

// Examiner Management
router.route('/')
  .get(getAllExaminers)
  .post(createExaminer);

router.route('/:id')
  .get(getExaminerById)
  .put(updateExaminer)
  .delete(deleteExaminer);

module.exports = router;
