const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    semester: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Subject',
    },
    internal: {
    type: Number,
    default: 0,
  },
  external: {
    type: Number,
    default: 0,
  },
    total: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      required: true,
    },
    examiner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Examiner',
    }
  },
  {
    timestamps: true,
  }
);

// Calculate total before saving
resultSchema.pre('save', async function () {
  this.total = this.internal + this.external;

  if (this.total >= 90) {
    this.grade = 'A+';
  } else if (this.total >= 80) {
    this.grade = 'A';
  } else if (this.total >= 70) {
    this.grade = 'B';
  } else if (this.total >= 60) {
    this.grade = 'C';
  } else if (this.total >= 50) {
    this.grade = 'D';
  } else {
    this.grade = 'F';
  }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;