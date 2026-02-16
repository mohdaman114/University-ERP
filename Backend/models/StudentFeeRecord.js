const mongoose = require('mongoose');

const studentFeeRecordSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'Cheque', 'Bank Transfer'],
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    remarks: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const StudentFeeRecord = mongoose.model('StudentFeeRecord', studentFeeRecordSchema);

module.exports = StudentFeeRecord;
