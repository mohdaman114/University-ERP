const mongoose = require('mongoose');

const timetableSchema = mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    subject: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
// Timetable will be managed by faculty module in future