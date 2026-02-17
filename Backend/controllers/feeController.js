const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const FeeStructure = require('../models/FeeStructure');
const StudentFeeRecord = require('../models/StudentFeeRecord');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Create or Update Fee Structure for a Course & Semester
// @route   POST /api/fees/structure
// @access  Accountant, Admin
const createFeeStructure = asyncHandler(async (req, res) => {
  let { courseId, semester, tuitionFee, libraryFee, examFee, otherFee, dueDate } = req.body;

  // Resolve Course ID if string provided
  if (typeof courseId === 'string' && !mongoose.Types.ObjectId.isValid(courseId)) {
    const courseDoc = await Course.findOne({ 
       $or: [
         { name: courseId },
         { courseType: courseId },
         { code: courseId }
       ]
    });
    if (courseDoc) {
      courseId = courseDoc._id;
    } else {
      res.status(400);
      throw new Error(`Course '${courseId}' not found. Please create course first.`);
    }
  }

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

// @desc    Get All Fee Structures
// @route   GET /api/fees/structures
// @access  Accountant, Admin
const getAllFeeStructures = asyncHandler(async (req, res) => {
  const feeStructures = await FeeStructure.find({})
    .populate('courseId', 'name')
    .sort({ courseId: 1, semester: 1 });
  res.json(feeStructures);
});

// @desc    Get Fee Structure for a Course
// @route   GET /api/fees/structure/:courseId
// @access  Accountant, Admin, Student
const getFeeStructureByCourse = asyncHandler(async (req, res) => {
  const feeStructures = await FeeStructure.find({ courseId: req.params.courseId }).sort({ semester: 1 });
  res.json(feeStructures);
});

// @desc    Delete Fee Structure
// @route   DELETE /api/fees/structure/:id
// @access  Accountant, Admin
const deleteFeeStructure = asyncHandler(async (req, res) => {
  const feeStructure = await FeeStructure.findById(req.params.id);

  if (feeStructure) {
    await feeStructure.deleteOne();
    res.json({ message: 'Fee structure removed' });
  } else {
    res.status(404);
    throw new Error('Fee structure not found');
  }
});

// @desc    Fetch Student Fee Details (Total, Paid, Pending)
// @route   GET /api/fees/student/:studentId
// @access  Accountant, Admin, Student
const getStudentFeeDetails = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  let student;

  // Try to find student by various IDs
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    student = await Student.findById(studentId).populate('course');
    if (!student) {
      student = await Student.findOne({ user: studentId }).populate('course');
    }
  }

  if (!student) {
    student = await Student.findOne({ studentId: studentId }).populate('course');
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Get all fee structures for the student's course up to their current semester
  // Logic: Users often want to see ALL fees, past and present. 
  // If we only show up to currentSemester, we might miss future dues if they want to pay in advance, 
  // or pass dues if they are in a higher semester.
  // For now, let's keep the logic to "applicable fees" which usually implies <= currentSemester + maybe next one?
  // Let's stick to the existing logic of <= currentSemester for now, or maybe all semesters if requested.
  // Actually, usually you owe fees for the semesters you have attended or are attending.
  
  // Resolve Course ID (Handle string course names like "BCA")
  let courseId = student.course && student.course._id ? student.course._id : student.course;
  let courseName = student.course && student.course.name ? student.course.name : student.course;

  if (typeof courseId === 'string' && !mongoose.Types.ObjectId.isValid(courseId)) {
    let courseDoc = await Course.findOne({ 
       $or: [
         { name: courseId },
         { courseType: courseId },
         { code: courseId }
       ]
    });
    if (courseDoc) {
      courseId = courseDoc._id;
      courseName = courseDoc.name;
    }
  }

  const feeStructures = await FeeStructure.find({
    courseId: courseId,
    semester: { $lte: student.currentSemester } 
  }).sort({ semester: 1 });

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
      _id: structure._id, // Useful for frontend keys
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
      transactionId: record ? record.transactionId : null,
      paymentMode: record ? record.paymentMode : null,
      remarks: record ? record.remarks : null
    });
  }

  res.json({
    studentId: student._id,
    studentName: student.name,
    course: courseName,
    currentSemester: student.currentSemester,
    feeSummary: feeDetails
  });
});

// @desc    Record Fee Payment
// @route   POST /api/fees/payment
// @access  Accountant, Admin
const recordFeePayment = asyncHandler(async (req, res) => {
  const { studentId, semester, amountPaid, paymentMode, transactionId, remarks } = req.body;

  let student;

  // Try to find student by various IDs
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    // 1. Try by _id (Student Document ID)
    student = await Student.findById(studentId);
    
    // 2. Try by user ID (User Document ID) if not found
    if (!student) {
      student = await Student.findOne({ user: studentId });
    }
  }

  // 3. Try by custom studentId (string field e.g. STU009) if still not found
  if (!student) {
    student = await Student.findOne({ studentId: studentId });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Resolve courseId (Handle case where student.course is a string name "BCA" vs ObjectId)
  let courseId = student.course;
  if (typeof courseId === 'string' && !mongoose.Types.ObjectId.isValid(courseId)) {
    // Try finding course by Name, Type, or Code
    let courseDoc = await Course.findOne({ 
      $or: [
        { name: courseId },
        { courseType: courseId },
        { code: courseId }
      ]
    });

    if (!courseDoc) {
      res.status(400);
      throw new Error(`Course '${courseId}' not found in database (checked Name, Type, Code). Cannot process fee.`);
    }
    courseId = courseDoc._id;
  }

  const feeStructure = await FeeStructure.findOne({
    courseId: courseId,
    semester: semester
  });

  if (!feeStructure) {
    res.status(404);
    throw new Error('Fee structure not defined for this semester');
  }

  let record = await StudentFeeRecord.findOne({
    studentId: student._id,
    feeStructureId: feeStructure._id
  });

  const paymentAmount = Number(amountPaid);

  if (record) {
    // Update existing record
    record.amountPaid += paymentAmount;
    record.paymentDate = Date.now(); // Update to latest payment date
    record.paymentMode = paymentMode; // Update to latest mode
    record.transactionId = transactionId; // Update to latest txn id
    // Append remarks instead of overwriting? Or just overwrite. Let's overwrite for now.
    record.remarks = remarks;
  } else {
    // Create new record
    record = new StudentFeeRecord({
      studentId: student._id,
      feeStructureId: feeStructure._id,
      amountPaid: paymentAmount,
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

// @desc    Get All Recent Payments (Ledger)
// @route   GET /api/fees/payments
// @access  Accountant, Admin
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await StudentFeeRecord.find({})
    .populate('studentId', 'name rollNumber')
    .populate({
      path: 'feeStructureId',
      select: 'semester courseId',
      populate: { path: 'courseId', select: 'name' }
    })
    .sort({ updatedAt: -1 })
    .limit(100); // Limit to recent 100 for now
    
  res.json(payments);
});

// @desc    Get My Fees (Student)
// @route   GET /api/fees/my
// @access  Student
const getMyFees = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate('course');

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  // Resolve Course ID (Handle string course names like "BCA")
  let courseId = student.course && student.course._id ? student.course._id : student.course;
  let courseName = student.course && student.course.name ? student.course.name : student.course;

  if (typeof courseId === 'string' && !mongoose.Types.ObjectId.isValid(courseId)) {
    let courseDoc = await Course.findOne({ 
       $or: [
         { name: courseId },
         { courseType: courseId },
         { code: courseId }
       ]
    });
    if (courseDoc) {
      courseId = courseDoc._id;
      courseName = courseDoc.name;
    }
  }

  const feeStructures = await FeeStructure.find({
    courseId: courseId,
    semester: { $lte: student.currentSemester }
  }).sort({ semester: 1 });

  const feeDetails = [];

  for (const structure of feeStructures) {
    let record = await StudentFeeRecord.findOne({
      studentId: student._id,
      feeStructureId: structure._id
    });

    const paid = record ? record.amountPaid : 0;
    const pending = structure.totalAmount - paid;
    const status = record ? record.status : 'Pending';

    feeDetails.push({
      _id: structure._id,
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
    studentName: student.name,
    course: courseName,
    currentSemester: student.currentSemester,
    feeSummary: feeDetails
  });
});

module.exports = {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureByCourse,
  deleteFeeStructure,
  getStudentFeeDetails,
  recordFeePayment,
  getAllPayments,
  getMyFees
};
