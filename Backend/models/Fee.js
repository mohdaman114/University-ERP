const mongoose = require('mongoose');

const feeSchema = mongoose.Schema(
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
    feeType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
// Fees will be managed by accountant module in future