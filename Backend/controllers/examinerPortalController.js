const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Result = require('../models/Result');
const Examiner = require('../models/Examiner');

// @desc    Get all students for examiner selection
// @route   GET /api/examiner-portal/students
// @access  Private (Examiner)
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).select('name studentId course branch currentSemester admissionYear');
  res.json(students);
});

// @desc    Get all subjects for examiner selection
// @route   GET /api/examiner-portal/subjects
// @access  Private (Examiner)
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({}).select('name code credits department');
  res.json(subjects);
});

// @desc    Get marks for a student
// @route   GET /api/examiner-portal/marks/:studentId/:subjectId
// @access  Private (Examiner)
const getStudentMarks = asyncHandler(async (req, res) => {
  const { studentId, subjectId } = req.params;

  const result = await Result.findOne({
    student: studentId,
    subject: subjectId
  });

  if (result) {
    res.json(result);
  } else {
    // Return empty structure if no result found
    res.json({
      internal: 0,
      external: 0,
      total: 0,
      grade: 'N/A'
    });
  }
});

// @desc    Update marks for a student
// @route   POST /api/examiner-portal/marks
// @access  Private (Examiner)
const updateMarks = asyncHandler(async (req, res) => {
  const { studentId, subjectId, term, marks: termMarks } = req.body;
  console.log('Incoming marks update request body:', req.body);
  
  if (!studentId || !subjectId || !term || termMarks === undefined) {
    res.status(400);  
    throw new Error('Student ID, Subject ID, Term, and Marks are required');
  }

  if (!['internal', 'external'].includes(term)) {
    res.status(400);
    throw new Error('Invalid term specified. Must be "internal" or "external"');
  }

  // Find the examiner
  let examiner = await Examiner.findOne({ user: req.user._id });
  if (!examiner) {
    // Fallback: Check if examiner exists by email (to handle duplicate key error)
    examiner = await Examiner.findOne({ email: req.user.email });

    if (examiner) {
      // If found by email but user ID mismatch, update user ID
      examiner.user = req.user._id;
      await examiner.save();
    } else {
        // If no examiner profile exists at all, create a basic one
        try {
          examiner = await Examiner.create({
            user: req.user._id,
            name: req.user.name || 'Examiner',
            email: req.user.email,
            examinerId: 'EX' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900), // More unique ID
            department: 'General', // Default department
            qualification: 'PhD', // Default qualification
            subjects: [] // Empty subjects initially
          });
          console.log('Created new examiner profile for user:', req.user._id);
        } catch (error) {
          console.error('Error creating examiner profile:', error);
          // If duplicate key e rror on examinerId (unlikely but possible), try again or log
          if (error.code === 11000) {
             // Handle duplicate key error specifically if needed, but the email check above should cover the most common case.
             // If it's examinerId collision, we can't easily retry here without loop.
             res.status(500);
             throw new Error('Examiner profile creation failed due to duplicate data: ' + error.message);
          }
          res.status(500);
          throw new Error('Failed to create examiner profile: ' + error.message);
        }
    }
  }
  console.log('Examiner found/created:', examiner);
  
  // Check if result exists
  let result = await Result.findOne({
    student: studentId,
    subject: subjectId
  });

  if (result) {
    // Update existing result
    result[term] = termMarks; // Dynamically update the specific term

    // Recalculate total and grade based on new internal/external structure
    const newTotal = (result.internal || 0) + (result.external || 0);
    let newGrade = 'F';
    if (newTotal >= 90) newGrade = 'A+';
    else if (newTotal >= 80) newGrade = 'A';
    else if (newTotal >= 70) newGrade = 'B';
    else if (newTotal >= 60) newGrade = 'C';
    else if (newTotal >= 50) newGrade = 'D';
    
    result.total = newTotal;
    result.grade = newGrade;
    result.examiner = examiner._id;
    try {
      await result.save();
      res.json(result);
    } catch (saveError) {
      console.error('Error saving updated result:', saveError);
      res.status(500);
      throw new Error('Failed to save updated result: ' + saveError.message);
    }
  } else {
    // Create new result
    const student = await Student.findById(studentId);
    console.log('Student found for new result:', student);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    const subject = await Subject.findById(subjectId);
    console.log('Subject found for new result:', subject);
    if (!subject) {
        res.status(404);
        throw new Error('Subject not found');
    }

    // Initialize all terms to 0, then set the specific term's marks
    let initialInternal = 0;
    let initialExternal = 0;

    if (term === 'internal') initialInternal = termMarks;
    else if (term === 'external') initialExternal = termMarks;

    const newTotal = (initialInternal || 0) + (initialExternal || 0);
    let newGrade = 'F';
    if (newTotal >= 90) newGrade = 'A+';
    else if (newTotal >= 80) newGrade = 'A';
    else if (newTotal >= 70) newGrade = 'B';
    else if (newTotal >= 60) newGrade = 'C';
    else if (newTotal >= 50) newGrade = 'D';

    try {
      result = await Result.create({
        student: studentId,
        subject: subjectId,
        semester: student.currentSemester.toString(),
        internal: initialInternal,
        external: initialExternal,
        total: newTotal,
        grade: newGrade,
        examiner: examiner._id
      });
      res.status(201).json(result);
    } catch (createError) {
      console.error('Error creating new result:', createError);
      res.status(500);
      throw new Error('Failed to create new result: ' + createError.message);
    }
  }
});

module.exports = {
  getStudents,
  getSubjects,
  getStudentMarks,
  updateMarks
};
