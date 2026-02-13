const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feesRoutes = require('./routes/feesRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const resultsRoutes = require('./routes/resultsRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const helmet = require('helmet');
const cors = require('cors'); // Ensure cors is imported here
const morgan = require('morgan');

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Allow all origins for debugging

app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('CORS middleware applied. Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/timetable', timetableRoutes);

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));