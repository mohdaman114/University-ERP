const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = asyncHandler(async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email role');

    if (student) {
      res.json({
        _id: student._id,
        name: student.name || (student.user ? student.user.name : ''),
        email: student.email || (student.user ? student.user.email : ''),
        studentId: student.studentId,
        enrollmentNumber: student.enrollmentNumber,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        address: student.address,
        phoneNumber: student.phoneNumber,
        parentName: student.parentName,
        parentPhoneNumber: student.parentPhoneNumber,
        course: student.course,
        branch: student.branch,
        admissionYear: student.admissionYear,
        currentSemester: student.currentSemester,
        profilePicture: student.profilePicture,
      });
    } else {
      res.status(404);
      throw new Error('Student profile not found');
    }
  } catch (error) {
    console.error('Error in getStudentProfile:', error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
});

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateStudentProfile = asyncHandler(async (req, res) => {
  console.log('🔄 Student Profile Update Route Hit');
  console.log('Request Body:', req.body); // Log incoming request body
  console.log('User ID from token:', req.user._id); // Log user ID from token
  const student = await Student.findOne({ user: req.user._id });

  if (student) {
    console.log('Student found:', student._id); // Log if student is found
    // Update User model fields if they are sent
    if (student.user) {
      const user = await User.findById(student.user);
      if (user) {
        let userUpdated = false;
        if (req.body.name) {
          user.name = req.body.name;
          userUpdated = true;
        }
        if (req.body.email) {
          user.email = req.body.email;
          userUpdated = true;
        }
        
        if (userUpdated) {
          try {
            await user.save();
            console.log('User updated successfully');
          } catch (userSaveError) {
            console.error('Error saving user:', userSaveError);
            res.status(500);
            throw new Error('Failed to save user: ' + userSaveError.message);
          }
        }
      }
    }

    console.log('Updating student fields...');
    student.studentId = req.body.studentId || student.studentId;
    student.enrollmentNumber = req.body.enrollmentNumber || student.enrollmentNumber;
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.gender = req.body.gender || student.gender;
    student.address = req.body.address || student.address;
    student.phoneNumber = req.body.phoneNumber || student.phoneNumber;
    student.parentName = req.body.parentName || student.parentName;
    student.parentPhoneNumber = req.body.parentPhoneNumber || student.parentPhoneNumber;
    student.course = req.body.course || student.course;
    student.branch = req.body.branch || student.branch;
    student.admissionYear = req.body.admissionYear || student.admissionYear;
    student.currentSemester = req.body.currentSemester || student.currentSemester;
    student.profilePicture = req.body.profilePicture || student.profilePicture;
    student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
    console.log('Student fields updated in memory. Student object before save:', student);

    try {
      const updatedStudent = await student.save();
      console.log('Student profile saved successfully. Updated student:', updatedStudent);

      // Re-populate user data to ensure the latest name is returned
      console.log('Attempting to populate user data for updated student.');
      await updatedStudent.populate('user', 'name email role');
      console.log('Student populated with user data.');

      res.json({
        _id: updatedStudent._id,
        name: updatedStudent.name || (updatedStudent.user ? updatedStudent.user.name : ''),
        email: updatedStudent.email || (updatedStudent.user ? updatedStudent.user.email : ''),
        studentId: updatedStudent.studentId,
        enrollmentNumber: updatedStudent.enrollmentNumber,
        dateOfBirth: updatedStudent.dateOfBirth,
        gender: updatedStudent.gender,
        address: updatedStudent.address,
        phoneNumber: updatedStudent.phoneNumber,
        parentName: updatedStudent.parentName,
        parentPhoneNumber: updatedStudent.parentPhoneNumber,
        course: updatedStudent.course,
        branch: updatedStudent.branch,
        admissionYear: updatedStudent.admissionYear,
        currentSemester: updatedStudent.currentSemester,
        profilePicture: updatedStudent.profilePicture,
      });
      console.log('Response sent successfully.');
    } catch (saveError) {
      console.error('Error saving student profile:', saveError);
      res.status(500);
      throw new Error('Failed to save student profile: ' + saveError.message);
    }
  } else {
    console.log('Student not found for user ID:', req.user._id);
    res.status(404);
    throw new Error('Student profile not found');
  }
});

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};