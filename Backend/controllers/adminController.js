const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Notice = require('../models/Notice');
const Accountant = require('../models/Accountant');
const Department = require('../models/Department'); // Import Department model
const Course = require('../models/Course'); // Import Course model
const Book = require('../models/Book'); // Import Book model

// --- User CRUD ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// --- Department CRUD ---

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private (Admin)
const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({});
  res.json(departments);
});

// --- Course CRUD ---

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private (Admin)
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// --- Book CRUD ---

// @desc    Get all books
// @route   GET /api/admin/books
// @access  Private (Admin)
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

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

  // Validate required fields
  if (!name || !email || !password || !studentId || !enrollmentNumber || !dateOfBirth || !gender || !address || !phoneNumber || !parentName || !parentPhoneNumber || !course || !branch || !admissionYear) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const studentExists = await Student.findOne({ 
    $or: [{ studentId }, { enrollmentNumber }] 
  });
  if (studentExists) {
    res.status(400);
    throw new Error('Student with this ID or Enrollment Number already exists');
  }

  try {
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
        currentSemester: currentSemester || 1
      });

      res.status(201).json(student);
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    // If user was created but student profile failed, cleanup user
    if (error.name === 'ValidationError') {
      const userToDelete = await User.findOne({ email });
      if (userToDelete) await User.findByIdAndDelete(userToDelete._id);
      res.status(400);
      throw new Error(error.message);
    }
    throw error;
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
      // Check if email is being updated and if it's unique
      if (req.body.email && req.body.email !== user.email) {
        const userWithNewEmail = await User.findOne({ email: req.body.email });
        if (userWithNewEmail && userWithNewEmail._id.toString() !== user._id.toString()) {
          res.status(400);
          throw new Error('User with this email already exists');
        }
      }

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

  // Validate required fields
  if (!name || !email || !password || !facultyId || !designation || !department || !dateOfJoining || !gender || !address || !phoneNumber || !qualification || !experience) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const facultyExists = await Faculty.findOne({ facultyId });
  if (facultyExists) {
    res.status(400);
    throw new Error('Faculty with this ID already exists');
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      role: 'faculty'
    });

    if (user) {
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
  } catch (error) {
    if (error.name === 'ValidationError') {
      const userToDelete = await User.findOne({ email });
      if (userToDelete) await User.findByIdAndDelete(userToDelete._id);
      res.status(400);
      throw new Error(error.message);
    }
    throw error;
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

// --- Accountant CRUD ---

// @desc    Get all accountants
// @route   GET /api/admin/accountants
// @access  Private (Admin)
const getAllAccountants = asyncHandler(async (req, res) => {
  const accountants = await Accountant.find({}).populate('user', 'role');
  res.json(accountants);
});

// @desc    Get accountant by ID
// @route   GET /api/admin/accountants/:id
// @access  Private (Admin)
const getAccountantById = asyncHandler(async (req, res) => {
  const accountant = await Accountant.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { accountantId: req.params.id }
    ]
  }).populate('user', 'role');

  if (accountant) {
    res.json(accountant);
  } else {
    res.status(404);
    throw new Error('Accountant not found');
  }
});

// @desc    Create new accountant
// @route   POST /api/admin/accountants
// @access  Private (Admin)
const createAccountant = asyncHandler(async (req, res) => {
  const { 
    name, email, password, accountantId, designation, 
    department, dateOfJoining, gender, address, 
    phoneNumber, qualification, experience 
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !accountantId || !designation) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const accountantExists = await Accountant.findOne({ accountantId });
  if (accountantExists) {
    res.status(400);
    throw new Error('Accountant with this ID already exists');
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      role: 'accountant'
    });

    if (user) {
      const accountant = await Accountant.create({
        user: user._id,
        name,
        email,
        accountantId,
        designation,
        department: department || 'Finance',
        dateOfJoining,
        gender,
        address,
        phoneNumber,
        qualification,
        experience
      });

      res.status(201).json(accountant);
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const userToDelete = await User.findOne({ email });
      if (userToDelete) await User.findByIdAndDelete(userToDelete._id);
      res.status(400);
      throw new Error(error.message);
    }
    throw error;
  }
});

// @desc    Update accountant
// @route   PUT /api/admin/accountants/:id
// @access  Private (Admin)
const updateAccountant = asyncHandler(async (req, res) => {
  const accountant = await Accountant.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { accountantId: req.params.id }
    ]
  });

  if (accountant) {
    // Update Accountant fields
    accountant.name = req.body.name || accountant.name;
    accountant.email = req.body.email || accountant.email;
    accountant.accountantId = req.body.accountantId || accountant.accountantId;
    accountant.designation = req.body.designation || accountant.designation;
    accountant.department = req.body.department || accountant.department;
    accountant.dateOfJoining = req.body.dateOfJoining || accountant.dateOfJoining;
    accountant.gender = req.body.gender || accountant.gender;
    accountant.address = req.body.address || accountant.address;
    accountant.phoneNumber = req.body.phoneNumber || accountant.phoneNumber;
    accountant.qualification = req.body.qualification || accountant.qualification;
    accountant.experience = req.body.experience || accountant.experience;

    const updatedAccountant = await accountant.save();

    // Sync with User model
    const user = await User.findById(accountant.user);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
    }

    res.json(updatedAccountant);
  } else {
    res.status(404);
    throw new Error('Accountant not found');
  }
});

// @desc    Delete accountant
// @route   DELETE /api/admin/accountants/:id
// @access  Private (Admin)
const deleteAccountant = asyncHandler(async (req, res) => {
  const accountant = await Accountant.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
      { accountantId: req.params.id }
    ]
  });

  if (accountant) {
    // Delete linked User
    await User.findByIdAndDelete(accountant.user);
    // Delete Accountant profile
    await Accountant.findByIdAndDelete(accountant._id);
    res.json({ message: 'Accountant and associated user account removed' });
  } else {
    res.status(404);
    throw new Error('Accountant not found');
  }
});

// --- Notice CRUD ---

// @desc    Get all notices
// @route   GET /api/admin/notices
// @access  Private (Admin)
const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find({});
  res.json(notices);
});

// @desc    Create new notice
// @route   POST /api/admin/notices
// @access  Private (Admin)
const createNotice = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please provide all required fields: title, description, category');
  }

  const notice = await Notice.create({
    title,
    description,
    category,
  });

  res.status(201).json(notice);
});

// @desc    Update notice
// @route   PUT /api/admin/notices/:id
// @access  Private (Admin)
const updateNotice = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  const notice = await Notice.findById(req.params.id);

  if (notice) {
    notice.title = title || notice.title;
    notice.description = description || notice.description;
    notice.category = category || notice.category;

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

// @desc    Delete notice
// @route   DELETE /api/admin/notices/:id
// @access  Private (Admin)
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (notice) {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice removed' });
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

// @desc    Get notice by ID
// @route   GET /api/admin/notices/:id
// @access  Private (Admin)
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (notice) {
    res.json(notice);
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password'); // Exclude password

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('Admin user not found');
  }
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
const updateAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.email && req.body.email !== user.email) {
      const userWithNewEmail = await User.findOne({ email: req.body.email });
      if (userWithNewEmail && userWithNewEmail._id.toString() !== user._id.toString()) {
        res.status(400);
        throw new Error('User with this email already exists');
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Admin user not found');
  }
});

// @desc    Change admin password (Ensured to be before module.exports)
// @route   PUT /api/admin/change-password
// @access  Private (Admin)
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (user) {
    if (!(await user.matchPassword(currentPassword))) {
      res.status(401);
      throw new Error('Invalid current password');
    }

    user.password = newPassword; // User model will hash this automatically
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
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
  deleteFaculty,
  getAllAccountants,
  getAccountantById,
  createAccountant,
  updateAccountant,
  deleteAccountant,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getAllUsers,
  getAllDepartments,
  getAllCourses,
  getAllBooks,
  getNoticeById, // Add getNoticeById here
  changePassword,
  getAdminProfile, // Add new functions here
  updateAdminProfile // Add new functions here
};
