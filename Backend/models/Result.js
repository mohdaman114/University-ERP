const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    semester: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
// Results will be managed by admin/exam module in future