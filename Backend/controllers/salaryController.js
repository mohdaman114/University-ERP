const FacultySalaryStructure = require('../models/FacultySalaryStructure');
const FacultySalaryRecord = require('../models/FacultySalaryRecord');
const Faculty = require('../models/Faculty');
const asyncHandler = require('express-async-handler');

// @desc    Create or Update Salary Structure
// @route   POST /api/salary/structure
// @access  Private (Admin/Accountant)
const updateSalaryStructure = asyncHandler(async (req, res) => {
  try {
    const { facultyId, baseSalary, hra, da, otherAllowances, deductions } = req.body;

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      res.status(404);
      throw new Error('Faculty not found');
    }

    let structure = await FacultySalaryStructure.findOne({ facultyId });

    if (structure) {
      structure.baseSalary = Number(baseSalary);
      structure.hra = Number(hra) || 0;
      structure.da = Number(da) || 0;
      structure.otherAllowances = Number(otherAllowances) || 0;
      structure.deductions = Number(deductions) || 0;
      
      // Calculate netSalary
      structure.netSalary = (structure.baseSalary || 0) + (structure.hra || 0) + (structure.da || 0) + (structure.otherAllowances || 0) - (structure.deductions || 0);

      await structure.save();
      res.status(200).json(structure);
    } else {
      // Calculate netSalary for new record
      const netSalary = (Number(baseSalary) || 0) + (Number(hra) || 0) + (Number(da) || 0) + (Number(otherAllowances) || 0) - (Number(deductions) || 0);
      
      structure = new FacultySalaryStructure({
        facultyId,
        baseSalary: Number(baseSalary),
        hra: Number(hra) || 0,
        da: Number(da) || 0,
        otherAllowances: Number(otherAllowances) || 0,
        deductions: Number(deductions) || 0,
        netSalary // Explicitly providing netSalary to satisfy required: true
      });
      await structure.save();
      res.status(201).json(structure);
    }
  } catch (error) {
    console.error('Error in updateSalaryStructure:', error);
    res.status(500);
    throw new Error(error.message || 'Server Error');
  }
});

// @desc    Get Salary Structure by Faculty ID
// @route   GET /api/salary/structure/:facultyId
// @access  Private (Admin/Accountant/Faculty)
const getSalaryStructure = asyncHandler(async (req, res) => {
  let facultyId = req.params.facultyId;

  // If faculty is requesting, they can only see their own
  if (req.user.role === 'faculty') {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      res.status(404);
      throw new Error('Faculty profile not found for this user');
    }
    facultyId = faculty._id;
  }

  const structure = await FacultySalaryStructure.findOne({ facultyId })
    .populate('facultyId', 'name facultyId department designation');
  
  if (!structure) {
    res.status(404);
    throw new Error('Salary structure not found');
  }
  res.json(structure);
});

// @desc    Record Salary Payment
// @route   POST /api/salary/payment
// @access  Private (Admin/Accountant)
const recordSalaryPayment = asyncHandler(async (req, res) => {
  const { facultyId, month, year, amountPaid, paymentMode, transactionId, remarks } = req.body;

  // Verify faculty
  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  // Get current structure to link (optional)
  const structure = await FacultySalaryStructure.findOne({ facultyId });

  const payment = new FacultySalaryRecord({
    facultyId,
    salaryStructureId: structure ? structure._id : null,
    month,
    year,
    amountPaid,
    paymentMode,
    transactionId,
    remarks,
    status: 'Paid'
  });

  await payment.save();
  res.status(201).json(payment);
});

// @desc    Get Payment History for a Faculty
// @route   GET /api/salary/history/:facultyId
// @access  Private (Admin/Accountant/Faculty)
const getPaymentHistory = asyncHandler(async (req, res) => {
  let facultyId = req.params.facultyId;

  // If faculty is requesting, they can only see their own
  if (req.user.role === 'faculty') {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      res.status(404);
      throw new Error('Faculty profile not found for this user');
    }
    facultyId = faculty._id;
  }

  const history = await FacultySalaryRecord.find({ facultyId })
    .sort({ createdAt: -1 })
    .populate('facultyId', 'name facultyId');
  
  res.json(history);
});

// @desc    Get All Payments (Ledger)
// @route   GET /api/salary/payments
// @access  Private (Admin/Accountant)
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await FacultySalaryRecord.find()
    .populate('facultyId', 'name facultyId department')
    .sort({ createdAt: -1 });
  res.json(payments);
});

// @desc    Get All Faculty (for salary management)
// @route   GET /api/salary/faculty
// @access  Private (Admin/Accountant)
const getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find({});
  res.json(faculty);
});

module.exports = {
  updateSalaryStructure,
  getSalaryStructure,
  recordSalaryPayment,
  getPaymentHistory,
  getAllPayments,
  getAllFaculty
};
