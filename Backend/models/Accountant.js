const mongoose = require('mongoose');

const accountantSchema = mongoose.Schema(
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
    accountantId: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'Finance',
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Accountant = mongoose.model('Accountant', accountantSchema);

module.exports = Accountant;