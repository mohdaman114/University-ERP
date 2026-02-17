const mongoose = require('mongoose');

const facultySalaryStructureSchema = mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      unique: true // One active structure per faculty
    },
    baseSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    effectiveDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Calculate netSalary before saving
facultySalaryStructureSchema.pre('save', async function() {
  this.netSalary = (this.baseSalary || 0) + (this.hra || 0) + (this.da || 0) + (this.otherAllowances || 0) - (this.deductions || 0);
});

const FacultySalaryStructure = mongoose.model('FacultySalaryStructure', facultySalaryStructureSchema);
module.exports = FacultySalaryStructure;
