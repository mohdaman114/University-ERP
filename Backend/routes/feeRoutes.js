const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureByCourse,
  deleteFeeStructure,
  getStudentFeeDetails,
  recordFeePayment,
  getAllPayments,
  getMyFees
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Fee Structure Routes
router.route('/structure')
  .post(protect, authorize('accountant', 'admin'), createFeeStructure);

router.route('/structures')
  .get(protect, authorize('accountant', 'admin'), getAllFeeStructures);

router.route('/structure/:courseId')
  .get(protect, authorize('accountant', 'admin', 'student'), getFeeStructureByCourse);

router.route('/structure/:id')
  .delete(protect, authorize('accountant', 'admin'), deleteFeeStructure);

// Fee Payment & Student Record Routes
router.route('/payment')
  .post(protect, authorize('accountant', 'admin'), recordFeePayment);

router.route('/payments')
  .get(protect, authorize('accountant', 'admin'), getAllPayments);

router.route('/student/:studentId')
  .get(protect, authorize('accountant', 'admin'), getStudentFeeDetails);

router.route('/my')
  .get(protect, authorize('student'), getMyFees);

module.exports = router;
