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
  deleteFaculty
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

module.exports = router;
