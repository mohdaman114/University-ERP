const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// --- Student CRUD ---

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).populate('user', 'role');
  res.json(students);
});

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { studentId: req.params.id }
    ]
  }).populate('user', 'role');

  if (student) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Create new student
// @route   POST /api/admin/students
// @access  Private (Admin)
const createStudent = asyncHandler(async (req, res) => {
  const { 
    name, email, password, studentId, enrollmentNumber, 
    dateOfBirth, gender, address, phoneNumber, 
    parentName, parentPhoneNumber, course, branch, 
    admissionYear, currentSemester 
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password, // User model handles hashing
    role: 'student'
  });

  if (user) {
    // Create Student Profile
    const student = await Student.create({
      user: user._id,
      name,
      email,
      studentId,
      enrollmentNumber,
      dateOfBirth,
      gender,
      address,
      phoneNumber,
      parentName,
      parentPhoneNumber,
      course,
      branch,
      admissionYear,
      currentSemester
    });

    res.status(201).json(student);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private (Admin)
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { studentId: req.params.id }
    ]
  });

  if (student) {
    // Update Student fields
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.studentId = req.body.studentId || student.studentId;
    student.enrollmentNumber = req.body.enrollmentNumber || student.enrollmentNumber;
    student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
    student.gender = req.body.gender || student.gender;
    student.address = req.body.address || student.address;
    student.phoneNumber = req.body.phoneNumber || student.phoneNumber;
    student.parentName = req.body.parentName || student.parentName;
    student.parentPhoneNumber = req.body.parentPhoneNumber || student.parentPhoneNumber;
    student.course = req.body.course || student.course;
    student.branch = req.body.branch || student.branch;
    student.admissionYear = req.body.admissionYear || student.admissionYear;
    student.currentSemester = req.body.currentSemester || student.currentSemester;

    const updatedStudent = await student.save();

    // Sync with User model
    const user = await User.findById(student.user);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
    }

    res.json(updatedStudent);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { studentId: req.params.id }
    ]
  });

  if (student) {
    // Delete linked User
    await User.findByIdAndDelete(student.user);
    // Delete Student profile
    await Student.findByIdAndDelete(student._id);
    res.json({ message: 'Student and associated user account removed' });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// --- Faculty CRUD ---

// @desc    Get all faculty
// @route   GET /api/admin/faculty
// @access  Private (Admin)
const getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find({}).populate('user', 'role');
  res.json(faculty);
});

// @desc    Get faculty by ID
// @route   GET /api/admin/faculty/:id
// @access  Private (Admin)
const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { facultyId: req.params.id }
    ]
  }).populate('user', 'role');

  if (faculty) {
    res.json(faculty);
  } else {
    res.status(404);
    throw new Error('Faculty member not found');
  }
});

// @desc    Create new faculty
// @route   POST /api/admin/faculty
// @access  Private (Admin)
const createFaculty = asyncHandler(async (req, res) => {
  const { 
    name, email, password, facultyId, designation, 
    department, dateOfJoining, gender, address, 
    phoneNumber, qualification, experience 
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role: 'faculty'
  });

  if (user) {
    // Create Faculty Profile
    const faculty = await Faculty.create({
      user: user._id,
      name,
      email,
      facultyId,
      designation,
      department,
      dateOfJoining,
      gender,
      address,
      phoneNumber,
      qualification,
      experience
    });

    res.status(201).json(faculty);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update faculty
// @route   PUT /api/admin/faculty/:id
// @access  Private (Admin)
const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { facultyId: req.params.id }
    ]
  });

  if (faculty) {
    // Update Faculty fields
    faculty.name = req.body.name || faculty.name;
    faculty.email = req.body.email || faculty.email;
    faculty.facultyId = req.body.facultyId || faculty.facultyId;
    faculty.designation = req.body.designation || faculty.designation;
    faculty.department = req.body.department || faculty.department;
    faculty.dateOfJoining = req.body.dateOfJoining || faculty.dateOfJoining;
    faculty.gender = req.body.gender || faculty.gender;
    faculty.address = req.body.address || faculty.address;
    faculty.phoneNumber = req.body.phoneNumber || faculty.phoneNumber;
    faculty.qualification = req.body.qualification || faculty.qualification;
    faculty.experience = req.body.experience || faculty.experience;

    const updatedFaculty = await faculty.save();

    // Sync with User model
    const user = await User.findById(faculty.user);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
    }

    res.json(updatedFaculty);
  } else {
    res.status(404);
    throw new Error('Faculty member not found');
  }
});

// @desc    Delete faculty
// @route   DELETE /api/admin/faculty/:id
// @access  Private (Admin)
const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { facultyId: req.params.id }
    ]
  });

  if (faculty) {
    // Delete linked User
    await User.findByIdAndDelete(faculty.user);
    // Delete Faculty profile
    await Faculty.findByIdAndDelete(faculty._id);
    res.json({ message: 'Faculty member and associated user account removed' });
  } else {
    res.status(404);
    throw new Error('Faculty member not found');
  }
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
};
