const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

// @desc    Get faculty profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
const getFacultyProfile = asyncHandler(async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id }).populate('user', 'name email role');

    if (faculty) {
      res.json({
        _id: faculty._id,
        name: faculty.name || (faculty.user ? faculty.user.name : ''),
        email: faculty.email || (faculty.user ? faculty.user.email : ''),
        facultyId: faculty.facultyId,
        designation: faculty.designation,
        department: faculty.department,
        dateOfJoining: faculty.dateOfJoining,
        gender: faculty.gender,
        address: faculty.address,
        phoneNumber: faculty.phoneNumber,
        qualification: faculty.qualification,
        experience: faculty.experience,
        profilePicture: faculty.profilePicture,
      });
    } else {
      res.status(404);
      throw new Error('Faculty profile not found');
    }
  } catch (error) {
    console.error('Error in getFacultyProfile:', error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
});

// @desc    Update faculty profile
// @route   PUT /api/faculty/profile
// @access  Private (Faculty)
const updateFacultyProfile = asyncHandler(async (req, res) => {
  console.log('🔄 Faculty Profile Update Route Hit');
  console.log('Request Body:', req.body);
  console.log('User ID from token:', req.user._id);
  const faculty = await Faculty.findOne({ user: req.user._id });

  if (faculty) {
    console.log('Faculty found:', faculty._id);
    // Update User model fields if they are sent
    if (faculty.user) {
      const user = await User.findById(faculty.user);
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

    console.log('Updating faculty fields...');
    faculty.name = req.body.name || faculty.name;
    faculty.email = req.body.email || faculty.email;
    faculty.designation = req.body.designation || faculty.designation;
    faculty.department = req.body.department || faculty.department;
    faculty.dateOfJoining = req.body.dateOfJoining || faculty.dateOfJoining;
    faculty.gender = req.body.gender || faculty.gender;
    faculty.address = req.body.address || faculty.address;
    faculty.phoneNumber = req.body.phoneNumber || faculty.phoneNumber;
    faculty.qualification = req.body.qualification || faculty.qualification;
    faculty.experience = req.body.experience || faculty.experience;
    faculty.profilePicture = req.body.profilePicture || faculty.profilePicture;
    console.log('Faculty fields updated in memory. Faculty object before save:', faculty);

    try {
      const updatedFaculty = await faculty.save();
      console.log('Faculty profile saved successfully. Updated faculty:', updatedFaculty);

      await updatedFaculty.populate('user', 'name email role');
      console.log('Faculty populated with user data.');

      res.json({
        _id: updatedFaculty._id,
        name: updatedFaculty.name || (updatedFaculty.user ? updatedFaculty.user.name : ''),
        email: updatedFaculty.email || (updatedFaculty.user ? updatedFaculty.user.email : ''),
        facultyId: updatedFaculty.facultyId,
        designation: updatedFaculty.designation,
        department: updatedFaculty.department,
        dateOfJoining: updatedFaculty.dateOfJoining,
        gender: updatedFaculty.gender,
        address: updatedFaculty.address,
        phoneNumber: updatedFaculty.phoneNumber,
        qualification: updatedFaculty.qualification,
        experience: updatedFaculty.experience,
        profilePicture: updatedFaculty.profilePicture,
      });
      console.log('Response sent successfully.');
    } catch (saveError) {
      console.error('Error saving faculty profile:', saveError);
      res.status(500);
      throw new Error('Failed to save faculty profile: ' + saveError.message);
    }
  } else {
    console.log('Faculty not found for user ID:', req.user._id);
    res.status(404);
    throw new Error('Faculty profile not found');
  }
});

// @desc    Update faculty password
// @route   PUT /api/faculty/password
// @access  Private (Faculty)
const updateFacultyPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error('New password and confirm new password do not match');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    if (!(await user.matchPassword(oldPassword))) {
      res.status(401);
      throw new Error('Invalid old password');
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getAllStudentsForFaculty = asyncHandler(async (req, res) => {
  const { semester, year } = req.query;
  const filter = {};

  if (semester) {
    filter.currentSemester = parseInt(semester);
  }
  if (year) {
    filter.admissionYear = parseInt(year);
  }

  const students = await Student.find(filter).populate('user', 'name email');
  
  // Format the response to include branch and semester directly
  const formattedStudents = students.map(student => {
      // Create a plain object to modify
      const studentObj = student.toObject();
      return {
          ...studentObj,
          name: studentObj.user ? studentObj.user.name : studentObj.name, // Fallback to student name if user not populated
          email: studentObj.user ? studentObj.user.email : studentObj.email,
          branch: studentObj.branch,
          semester: studentObj.currentSemester // Changed from semester to currentSemester
      };
  });
  
  res.json(formattedStudents);
});

// @desc    Mark attendance for a student
// @route   POST /api/faculty/attendance
// @access  Private (Faculty)
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, subject: subjectId, date, status } = req.body; // Renamed subject to subjectId

  if (!studentId || !subjectId || !date || !status) {
    res.status(400);
    throw new Error('Please provide studentId, subjectId, date, and status');
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Try to find subject in Subject model first, then Course model as fallback
  let subjectName = '';
  const subject = await Subject.findById(subjectId);
  
  if (subject) {
    subjectName = subject.name;
  } else {
    const course = await Course.findById(subjectId);
    if (course) {
      subjectName = course.name;
    } else {
      res.status(404);
      throw new Error('Subject not found');
    }
  }

  // Check if attendance already exists for this student, subject, and date
  let attendance = await Attendance.findOne({
    studentId,
    subject: subjectName, // Use subjectName here
    date: new Date(date),
  });

  if (attendance) {
    // Update existing attendance
    attendance.status = status;
    attendance.markedBy = req.user._id;
    await attendance.save();
    res.json({ message: 'Attendance updated successfully', attendance });
  } else {
    // Create new attendance record
    attendance = await Attendance.create({
      studentId,
      subject: subjectName, // Use subjectName here
      date: new Date(date),
      status,
      markedBy: req.user._id,
    });
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  }
});

// @desc    Get subjects taught by the faculty
// @route   GET /api/faculty/subjects
// @access  Private (Faculty)
const getFacultySubjects = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id }).populate('subjects');

  if (faculty) {
    res.json(faculty.subjects.filter(subject => subject !== null));
  } else {
    res.status(404);
    throw new Error('Faculty not found');
  }
});

// @desc    Create a new subject (course) and add to faculty
// @route   POST /api/faculty/subjects
// @access  Private (Faculty)
const createSubject = asyncHandler(async (req, res) => {
  const { name, code, credits, department } = req.body;

  if (!name || !code || !credits) {
    res.status(400);
    throw new Error('Please provide name, code, and credits');
  }

  const faculty = await Faculty.findOne({ user: req.user._id });

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  // Check if subject already exists
  const subjectExists = await Subject.findOne({ code });
  if (subjectExists) {
      // If it exists, just add to faculty's list if not already there
      if (!faculty.subjects.some(id => id.toString() === subjectExists._id.toString())) {
          faculty.subjects.push(subjectExists._id);
          await faculty.save();
          res.status(200).json(subjectExists);
          return;
      } else {
          res.status(400);
          throw new Error('Subject already added to faculty');
      }
  }

  const subject = await Subject.create({
    name,
    code,
    credits,
    department
  });

  if (subject) {
    faculty.subjects.push(subject._id);
    await faculty.save();
    res.status(201).json(subject);
  } else {
    res.status(400);
    throw new Error('Invalid subject data');
  }
});

// @desc    Update a subject
// @route   PUT /api/faculty/subjects/:id
// @access  Private (Faculty)
const updateSubject = asyncHandler(async (req, res) => {
    const { name, code, credits, department } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (subject) {
        // Check if faculty has this subject
        const faculty = await Faculty.findOne({ user: req.user._id });
        if (!faculty || !faculty.subjects.some(id => id.toString() === subject._id.toString())) {
            res.status(403);
            throw new Error('Not authorized to update this subject');
        }

        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.credits = credits || subject.credits;
        subject.department = department || subject.department;
        
        const updatedSubject = await subject.save();
        res.json(updatedSubject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Delete a subject
// @route   DELETE /api/faculty/subjects/:id
// @access  Private (Faculty)
const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
        const faculty = await Faculty.findOne({ user: req.user._id });
        
        if (!faculty) {
            res.status(404);
            throw new Error('Faculty not found');
        }

        // Remove from faculty's subjects list
        faculty.subjects = faculty.subjects.filter(
            (subjectId) => subjectId.toString() !== subject._id.toString()
        );
        await faculty.save();

        // Optionally delete the subject document itself?
        // For this task, I'll delete it to fulfill "CRUD".
        await subject.deleteOne();

        res.json({ message: 'Subject removed' });
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

module.exports = {
  getFacultyProfile,
  updateFacultyProfile,
  updateFacultyPassword,
  getAllStudentsForFaculty,
  markAttendance,
  getFacultySubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};