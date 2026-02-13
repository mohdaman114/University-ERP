const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const students = require('./data/students');
const faculty = require('./data/faculty');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();

    // Create users one by one to trigger 'pre-save' hashing in User model
    const createdUsers = [];
    for (const user of users) {
      const newUser = await User.create(user);
      createdUsers.push(newUser);
    }

    const adminUser = createdUsers.find(u => u.role === 'admin')._id;
    const studentUser = createdUsers.find(u => u.role === 'student')._id;
    const facultyUser = createdUsers.find(u => u.role === 'faculty')._id;

    const sampleStudents = students.map((student) => {
      return { ...student, user: studentUser };
    });

    const sampleFaculty = faculty.map((f) => {
      return { ...f, user: facultyUser };
    });

    await Student.insertMany(sampleStudents);
    await Faculty.insertMany(sampleFaculty);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();

    console.log('🗑️ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
