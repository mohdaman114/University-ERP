const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['present', 'absent'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming faculty will be users
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
// Attendance will be created/updated by faculty module in future