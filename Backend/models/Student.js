const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parentPhoneNumber: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    admissionYear: {
      type: Number,
      required: true,
    },
    currentSemester: {
      type: Number,
      required: true,
      default: 1,
    },
    profilePicture: {
      type: String,
      default: '/uploads/default.png',
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;