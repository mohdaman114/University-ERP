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
  // Course imports
  getAllCourses,
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
  .get(getAllDepartments);

// Course Management (for dashboard analytics)
router.route('/courses')
  .get(getAllCourses);

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
