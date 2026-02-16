const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },

    totalFees: {
      type: Number,
      required: true,
    },
    totalDuration: {
      type: String, // Duration in years or semesters
      required: true,
    },
    courseType: {
      type: String, // e.g., 'B.Tech', 'BCA', 'B.Pharma'
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;