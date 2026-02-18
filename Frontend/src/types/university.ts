// User roles
export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'student' 
  | 'faculty' 
  | 'examiner' 
  | 'accountant' 
  | 'library' 
  | 'support';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  departmentId?: string;
  enrollmentNumber?: string; // for students
  employeeId?: string; // for faculty/staff
}

// Accountant
export interface Accountant extends User {
  accountantId: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  phoneNumber?: string;
  qualification?: string;
  experience?: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  hodId?: string;
  description?: string;
}

// Course
export interface Course {
  id: string;
  name: string;
  code: string;
  totalDuration: string; // in years or semesters
  totalFees: number;
  courseType: string; // e.g., 'B.Tech', 'BCA', 'B.Pharma'
  credits: number;
  description?: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semester: number;
  credits: number;
  facultyId?: string;
}

// Batch
export interface Batch {
  id: string;
  courseId: string;
  year: number;
  semester: number;
  startDate: string;
  endDate: string;
}

// Student
export interface Student extends User {
  courseId: string;
  batchId: string;
  semester: number;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
}

// Attendance
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
}

// Examination
export interface Examination {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  type: 'midterm' | 'final' | 'practical' | 'assignment';
}

// Result
export interface Result {
  id: string;
  studentId: string;
  examinationId: string;
  marksObtained: number;
  grade: string;
  status: 'pass' | 'fail' | 'absent' | 'pending';
}

// Fee Structure
export interface FeeStructure {
  id: string;
  courseId: string;
  semester: number;
  tuitionFee: number;
  libraryFee: number;
  examFee: number;
  otherFees: number;
  total: number;
}

// Fee Payment
export interface FeePayment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'online' | 'cash' | 'cheque' | 'dd';
  transactionId?: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNumber: string;
}

// Library Book
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

// Book Issue
export interface BookIssue {
  id: string;
  bookId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
  status: 'issued' | 'returned' | 'overdue';
}

// Notice
export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'examination' | 'event' | 'urgent';
  publishedBy: string;
  date: string; // Changed from publishedDate
  expiryDate?: string;
  targetRoles: UserRole[];
  attachments?: string[];
}

// Timetable
export interface TimetableEntry {
  id: string;
  subjectId: string;
  facultyId: string;
  batchId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  roomNumber: string;
}

// Study Material
export interface StudyMaterial {
  id: string;
  title: string;
  subjectId: string;
  uploadedBy: string;
  uploadDate: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  description?: string;
}

// Analytics Data
export interface AnalyticsData {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  totalCourses: number;
  totalAccountant: number;
  totalRevenue: number;
  pendingFees: number;
  totalBooks: number;
}
