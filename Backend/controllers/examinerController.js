const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Examiner = require('../models/Examiner');
const User = require('../models/User');

// @desc    Create Examiner
// @route   POST /api/examiners
// @access  Admin
const createExaminer = asyncHandler(async (req, res) => {
  const { name, email, password, examinerId, department, qualification, subjects } = req.body;

  if (!name || !email || !password || !examinerId || !department || !qualification) {
    res.status(400);
    throw new Error('Please enter all the required fields');
  }

  // Filter out invalid subject IDs
  let validSubjects = [];
  if (subjects && Array.isArray(subjects)) {
    validSubjects = subjects.filter(id => id && mongoose.Types.ObjectId.isValid(id));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const examinerExists = await Examiner.findOne({ examinerId });
  if (examinerExists) {
    res.status(400);
    throw new Error('Examiner with this ID already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'examiner',
  });

  if (user) {
    const examiner = await Examiner.create({
      user: user._id,
      name,
      email,
      examinerId,
      department,
      qualification,
      subjects: validSubjects,
    });

    if (examiner) {
      res.status(201).json({
        _id: examiner._id,
        name: examiner.name,
        email: examiner.email,
        examinerId: examiner.examinerId,
        department: examiner.department,
        qualification: examiner.qualification,
        subjects: examiner.subjects,
        user: user._id,
      });
    } else {
      res.status(400);
      throw new Error('Invalid examiner data');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all examiners
// @route   GET /api/examiners
// @access  Admin
const getAllExaminers = asyncHandler(async (req, res) => {
  const examiners = await Examiner.find({}).populate('user', 'id name email').populate('subjects', 'name');
  res.json(examiners);
});

// @desc    Get examiner by ID
// @route   GET /api/examiners/:id
// @access  Admin
const getExaminerById = asyncHandler(async (req, res) => {
  const examiner = await Examiner.findById(req.params.id).populate('user', 'id name email').populate('subjects', 'name');

  if (examiner) {
    res.json(examiner);
  } else {
    res.status(404);
    throw new Error('Examiner not found');
  }
});

// @desc    Update examiner
// @route   PUT /api/examiners/:id
// @access  Admin
const updateExaminer = asyncHandler(async (req, res) => {
  const { name, email, examinerId, department, qualification, subjects } = req.body;

  const examiner = await Examiner.findById(req.params.id);

  if (examiner) {
    let validSubjects = subjects;
    if (subjects && Array.isArray(subjects)) {
      validSubjects = subjects.filter(id => id && mongoose.Types.ObjectId.isValid(id));
    }

    examiner.name = name || examiner.name;
    examiner.email = email || examiner.email;
    examiner.examinerId = examinerId || examiner.examinerId;
    examiner.department = department || examiner.department;
    examiner.qualification = qualification || examiner.qualification;
    examiner.subjects = validSubjects || examiner.subjects;

    const updatedExaminer = await examiner.save();

    // Update the associated User model if email or name changed
    const user = await User.findById(examiner.user);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }

    res.json({
      _id: updatedExaminer._id,
      name: updatedExaminer.name,
      email: updatedExaminer.email,
      examinerId: updatedExaminer.examinerId,
      department: updatedExaminer.department,
      qualification: updatedExaminer.qualification,
      subjects: updatedExaminer.subjects,
    });
  } else {
    res.status(404);
    throw new Error('Examiner not found');
  }
});

// @desc    Delete examiner
// @route   DELETE /api/examiners/:id
// @access  Admin
const deleteExaminer = asyncHandler(async (req, res) => {
  const examiner = await Examiner.findById(req.params.id);

  if (examiner) {
    await Examiner.deleteOne({ _id: examiner._id });
    await User.deleteOne({ _id: examiner.user });
    res.json({ message: 'Examiner removed' });
  } else {
    res.status(404);
    throw new Error('Examiner not found');
  }
});

module.exports = {
  createExaminer,
  getAllExaminers,
  getExaminerById,
  updateExaminer,
  deleteExaminer,
};