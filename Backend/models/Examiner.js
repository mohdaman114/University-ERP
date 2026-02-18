const mongoose = require('mongoose');

const examinerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    examinerId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    profilePicture: {
      type: String,
      default: '/uploads/default.png',
    },
  },
  {
    timestamps: true,
  }
);

const Examiner = mongoose.model('Examiner', examinerSchema);

module.exports = Examiner;
