const dotenv = require('dotenv');
const users = require('./data/users');
const students = require('./data/students');
const User = require('./models/User');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Student.deleteMany();

    const createdUsers = [];
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }

    const studentUser = createdUsers[0]._id;

    const sampleStudents = students.map((student) => {
      return { ...student, user: studentUser };
    });

    await Student.insertMany(sampleStudents);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Student.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}