const mongoose = require('mongoose');

const feeStructureSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    tuitionFee: {
      type: Number,
      required: true,
    },
    libraryFee: {
      type: Number,
      default: 0,
    },
    examFee: {
      type: Number,
      default: 0,
    },
    otherFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Calculate totalAmount before saving
feeStructureSchema.pre('save', function() {
  this.totalAmount = (this.tuitionFee || 0) + (this.libraryFee || 0) + (this.examFee || 0) + (this.otherFee || 0);
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

module.exports = FeeStructure;
