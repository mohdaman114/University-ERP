const asyncHandler = require('express-async-handler');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get student timetable
// @route   GET /api/timetable
// @access  Private (Student)
const getStudentTimetable = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const timetable = await Timetable.find({ 
    course: student.course, 
    semester: student.currentSemester.toString() 
  });

  res.json(timetable);
});

// @desc    Get faculty timetable
// @route   GET /api/timetable/faculty
// @access  Private (Faculty)
const getFacultyTimetable = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id });

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty profile not found');
  }

  // Find timetables where the faculty name matches
  // Note: Ideally, we should use ID reference, but current schema uses name string
  // Escape special characters in faculty name for regex
  const escapedName = faculty.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const timetables = await Timetable.find({ 
    faculty: { $regex: new RegExp(`^${escapedName}$`, 'i') } 
  });

  res.json(timetables);
});

// @desc    Get all timetables (Admin)
// @route   GET /api/timetable/all
// @access  Private (Admin)
const getAllTimetables = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  let query = {};

  if (keyword) {
    query = {
      $or: [
        { course: { $regex: keyword, $options: 'i' } },
        { semester: { $regex: keyword, $options: 'i' } },
        { subject: { $regex: keyword, $options: 'i' } },
        { faculty: { $regex: keyword, $options: 'i' } },
      ],
    };
  }

  const timetables = await Timetable.find(query);
  res.json(timetables);
});

// @desc    Create a timetable entry
// @route   POST /api/timetable
// @access  Private (Admin)
const createTimetable = asyncHandler(async (req, res) => {
  const { course, semester, day, subject, time, faculty } = req.body;

  if (!course || !semester || !day || !subject || !time || !faculty) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const timetable = await Timetable.create({
    course,
    semester,
    day,
    subject,
    time,
    faculty,
  });

  res.status(201).json(timetable);
});

// @desc    Update a timetable entry
// @route   PUT /api/timetable/:id
// @access  Private (Admin)
const updateTimetable = asyncHandler(async (req, res) => {
  const { course, semester, day, subject, time, faculty } = req.body;
  const timetable = await Timetable.findById(req.params.id);

  if (timetable) {
    timetable.course = course || timetable.course;
    timetable.semester = semester || timetable.semester;
    timetable.day = day || timetable.day;
    timetable.subject = subject || timetable.subject;
    timetable.time = time || timetable.time;
    timetable.faculty = faculty || timetable.faculty;

    const updatedTimetable = await timetable.save();
    res.json(updatedTimetable);
  } else {
    res.status(404);
    throw new Error('Timetable entry not found');
  }
});

// @desc    Delete a timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
const deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (timetable) {
    await timetable.deleteOne();
    res.json({ message: 'Timetable entry removed' });
  } else {
    res.status(404);
    throw new Error('Timetable entry not found');
  }
});

module.exports = {
  getStudentTimetable,
  getFacultyTimetable,
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
};
