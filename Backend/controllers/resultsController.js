const asyncHandler = require('express-async-handler');
const Result = require('../models/Result');
const Student = require('../models/Student');

// @desc    Get student results
// @route   GET /api/results
// @access  Private (Student)
const getStudentResults = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const results = await Result.find({ student: student._id }).populate('subject', 'name code credits');

  // Transform results into the expected SemesterResult[] format
  const semesterMap = {};

  results.forEach(result => {
    const sem = result.semester;
    if (!semesterMap[sem]) {
      semesterMap[sem] = {
        semester: `Semester ${sem}`,
        gpa: 0,
        subjects: [],
        totalCredits: 0,
        totalPoints: 0
      };
    }

    const gradePoints = {
      'A+': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'F': 0
    };
    
    // Check if result.subject is populated
    if (result.subject) {
      const points = gradePoints[result.grade] || 0;
      const credits = result.subject.credits || 0;

      semesterMap[sem].subjects.push({
          subject: result.subject.name,
          internal: result.internal,
          external: result.external,
          grade: result.grade,
          status: result.grade === 'F' ? 'Fail' : 'Pass'
        });

      semesterMap[sem].totalPoints += points * credits;
      semesterMap[sem].totalCredits += credits;
    } else {
        // Handle case where subject is not found (deleted or reference error)
        semesterMap[sem].subjects.push({
            subject: 'Unknown Subject',
            grade: result.grade,
            status: result.grade === 'F' ? 'Fail' : 'Pass'
        });
    }
  });

  const formattedResults = Object.keys(semesterMap).map(semKey => {
    const semData = semesterMap[semKey];
    const gpa = semData.totalCredits > 0 ? (semData.totalPoints / semData.totalCredits).toFixed(2) : 0;
    return {
      semester: semData.semester,
      gpa: Number(gpa),
      subjects: semData.subjects
    };
  });
  
  // Sort semesters? Assuming numeric string for semester or just rely on insertion order if appropriate
  // formattedResults.sort((a, b) => a.semester.localeCompare(b.semester));

  res.json(formattedResults);
});

module.exports = {
  getStudentResults,
};