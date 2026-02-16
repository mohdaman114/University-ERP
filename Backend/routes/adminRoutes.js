const express = require('express');
const router = express.Router();
const {
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
  // Accountant imports
  getAllAccountants,
  getAccountantById,
  createAccountant,
  updateAccountant,
  deleteAccountant,
  // Notice imports
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  // User imports
  getAllUsers,
  changePassword,
  getAdminProfile, // Add new functions here
  updateAdminProfile, // Add new functions here
  // Department imports
  getAllDepartments,
  createDepartment, // Import createDepartment
  // Course imports
  getAllCourses,
  createCourse, // Import createCourse
  updateCourse, // Import updateCourse
  deleteCourse, // Import deleteCourse
  createFeeStructure, // Import createFeeStructure
  // Book imports
  getAllBooks
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Student Management
router.route('/students')
  .get(getAllStudents)
  .post(createStudent);

router.route('/students/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

// Faculty Management
router.route('/faculty')
  .get(getAllFaculty)
  .post(createFaculty);

router.route('/faculty/:id')
  .get(getFacultyById)
  .put(updateFaculty)
  .delete(deleteFaculty);

// Accountant Management
router.route('/accountants')
  .get(getAllAccountants)
  .post(createAccountant);

router.route('/accountants/:id')
  .get(getAccountantById)
  .put(updateAccountant)
  .delete(deleteAccountant);

// Notice Management
router.route('/notices')
  .get(getAllNotices)
  .post(createNotice);

router.route('/notices/:id')
  .get(getNoticeById)
  .put(updateNotice)
  .delete(deleteNotice);

// User Management (for dashboard analytics)
router.route('/users')
  .get(getAllUsers);

// Department Management (for dashboard analytics)
router.route('/departments')
  .get(getAllDepartments)
  .post(createDepartment); // Add POST route

// Course Management (for dashboard analytics)
router.route('/courses')
  .get(getAllCourses)
  .post(createCourse);

router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse); // Add POST route

// Fee Structure Management
router.route('/fees/structure')
  .post(createFeeStructure); // Add POST route

// Book Management (for dashboard analytics)
router.route('/books')
  .get(getAllBooks);

// Admin Profile Management
router.route('/profile')
  .get(getAdminProfile)
  .put(updateAdminProfile);

router.route('/change-password')
  .put(changePassword);

module.exports = router;
