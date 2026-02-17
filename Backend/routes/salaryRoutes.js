const express = require('express');
const router = express.Router();
const {
  updateSalaryStructure,
  getSalaryStructure,
  recordSalaryPayment,
  getPaymentHistory,
  getAllPayments,
  getAllFaculty
} = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define routes
router.route('/faculty')
  .get(protect, authorize('admin', 'accountant'), getAllFaculty);

router.route('/structure')
  .post(protect, authorize('admin', 'accountant'), updateSalaryStructure);

router.route('/structure/:facultyId')
  .get(protect, authorize('admin', 'accountant', 'faculty'), getSalaryStructure);

router.route('/payment')
  .post(protect, authorize('admin', 'accountant'), recordSalaryPayment);

router.route('/history/:facultyId')
  .get(protect, authorize('admin', 'accountant', 'faculty'), getPaymentHistory);

router.route('/payments')
  .get(protect, authorize('admin', 'accountant'), getAllPayments);

module.exports = router;
