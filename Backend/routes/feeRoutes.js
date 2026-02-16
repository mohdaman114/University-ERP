const express = require('express');
const asyncHandler = require('express-async-handler');
const FeeStructure = require('../models/FeeStructure');
const StudentFeeRecord = require('../models/StudentFeeRecord');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { protect, accountant } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Create or Update Fee Structure for a Course & Semester
// @route   POST /api/fees/structure
// @access  Accountant, Admin
const createFeeStructure = asyncHandler(async (req, res) => {
  const { courseId, semester, tuitionFee, libraryFee, examFee, otherFee, dueDate } = req.body;

  let feeStructure = await FeeStructure.findOne({ courseId, semester });

  if (feeStructure) {
    feeStructure.tuitionFee = tuitionFee;
    feeStructure.libraryFee = libraryFee;
    feeStructure.examFee = examFee;
    feeStructure.otherFee = otherFee;
    feeStructure.dueDate = dueDate;
    // totalAmount will be auto-calculated by pre-save hook
    await feeStructure.save();
    res.json(feeStructure);
  } else {
    feeStructure = await FeeStructure.create({
      courseId,
      semester,
      tuitionFee,
      libraryFee,
      examFee,
      otherFee,
      dueDate,
      totalAmount: 0 // Will be recalculated
    });
    res.status(201).json(feeStructure);
  }
});

// @desc    Get Fee Structure for a Course
// @route   GET /api/fees/structure/:courseId
// @access  Accountant, Admin, Student
const getFeeStructure = asyncHandler(async (req, res) => {
  const feeStructures = await FeeStructure.find({ courseId: req.params.courseId }).sort({ semester: 1 });
  res.json(feeStructures);
});

// @desc    Fetch Student Fee Details (Total, Paid, Pending)
// @route   GET /api/fees/student/:studentId
// @access  Accountant, Admin, Student
const getStudentFeeDetails = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate('course');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Get all fee structures for the student's course up to their current semester
  const feeStructures = await FeeStructure.find({
    courseId: student.course._id,
    semester: { $lte: student.currentSemester } // Fees applicable up to current semester
  });

  const feeDetails = [];

  for (const structure of feeStructures) {
    // Find payment record for this structure
    let record = await StudentFeeRecord.findOne({
      studentId: student._id,
      feeStructureId: structure._id
    });

    const paid = record ? record.amountPaid : 0;
    const pending = structure.totalAmount - paid;
    const status = record ? record.status : 'Pending';

    feeDetails.push({
      semester: structure.semester,
      totalAmount: structure.totalAmount,
      paidAmount: paid,
      pendingAmount: pending,
      status: status,
      dueDate: structure.dueDate,
      breakdown: {
        tuition: structure.tuitionFee,
        library: structure.libraryFee,
        exam: structure.examFee,
        other: structure.otherFee
      },
      lastPaymentDate: record ? record.paymentDate : null,
      transactionId: record ? record.transactionId : null
    });
  }

  res.json({
    studentName: student.name, // Accessing virtual or populated name if available
    course: student.course.name,
    currentSemester: student.currentSemester,
    feeSummary: feeDetails
  });
});

// @desc    Record Fee Payment
// @route   POST /api/fees/payment
// @access  Accountant
const recordFeePayment = asyncHandler(async (req, res) => {
  const { studentId, semester, amountPaid, paymentMode, transactionId, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const feeStructure = await FeeStructure.findOne({
    courseId: student.course,
    semester: semester
  });

  if (!feeStructure) {
    res.status(404);
    throw new Error('Fee structure not defined for this semester');
  }

  let record = await StudentFeeRecord.findOne({
    studentId,
    feeStructureId: feeStructure._id
  });

  if (record) {
    // Update existing record (e.g., partial payment becoming full)
    record.amountPaid += Number(amountPaid);
    record.paymentDate = Date.now();
    record.paymentMode = paymentMode;
    record.transactionId = transactionId;
    record.remarks = remarks;
  } else {
    // Create new record
    record = new StudentFeeRecord({
      studentId,
      feeStructureId: feeStructure._id,
      amountPaid,
      paymentDate: Date.now(),
      paymentMode,
      transactionId,
      remarks
    });
  }

  // Update Status
  if (record.amountPaid >= feeStructure.totalAmount) {
    record.status = 'Paid';
  } else if (record.amountPaid > 0) {
    record.status = 'Partial';
  } else {
    record.status = 'Pending';
  }

  await record.save();
  res.json(record);
});

router.post('/structure', protect, createFeeStructure); // Add 'accountant' middleware in production
router.get('/structure/:courseId', protect, getFeeStructure);
router.get('/student/:studentId', protect, getStudentFeeDetails);
router.post('/payment', protect, recordFeePayment); // Add 'accountant' middleware in production

module.exports = router;
