const mongoose = require('mongoose');

const facultySalaryRecordSchema = mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    salaryStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacultySalaryStructure',
    },
    month: { type: String, required: true }, // e.g., "January"
    year: { type: Number, required: true }, // e.g., 2024
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ['Bank Transfer', 'Cheque', 'Cash'], default: 'Bank Transfer' },
    transactionId: { type: String },
    status: { type: String, enum: ['Paid', 'Processing', 'Failed'], default: 'Paid' },
    remarks: { type: String }
  },
  { timestamps: true }
);

const FacultySalaryRecord = mongoose.model('FacultySalaryRecord', facultySalaryRecordSchema);
module.exports = FacultySalaryRecord;
