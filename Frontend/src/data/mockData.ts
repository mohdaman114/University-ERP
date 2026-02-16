import type {
  User,
  Department,
  Course,
  Subject,
  Batch,
  Student,
  Attendance,
  Examination,
  Result,
  FeeStructure,
  FeePayment,
  Book,
  BookIssue,
  Notice,
  TimetableEntry,
  StudyMaterial,
  AnalyticsData,
} from '@/types/university';

// Mock Users (with credentials for demo)
export const mockUsers: (User & { password: string })[] = [
  {
    id: 'u1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'Dr. Rajesh Kumar',
    role: 'super_admin',
    phone: '+91 98765 43210',
  },
  {
    id: 'u2',
    email: 'student@university.edu',
    password: 'student123',
    name: 'Priya Sharma',
    role: 'student',
    phone: '+91 98765 43211',
    departmentId: 'd1',
    enrollmentNumber: 'CS2023001',
  },
  {
    id: 'u3',
    email: 'faculty@university.edu',
    password: 'faculty123',
    name: 'Prof. Amit Patel',
    role: 'faculty',
    phone: '+91 98765 43212',
    departmentId: 'd1',
    employeeId: 'EMP001',
  },
  {
    id: 'u4',
    email: 'exam@university.edu',
    password: 'exam123',
    name: 'Dr. Meera Desai',
    role: 'examination',
    phone: '+91 98765 43213',
    employeeId: 'EMP002',
  },
  {
    id: 'u5',
    email: 'accounts@university.edu',
    password: 'accounts123',
    name: 'Mr. Suresh Reddy',
    role: 'accountant',
    phone: '+91 98765 43214',
    employeeId: 'EMP003',
  },
  {
    id: 'u6',
    email: 'library@university.edu',
    password: 'library123',
    name: 'Ms. Anjali Singh',
    role: 'library',
    phone: '+91 98765 43215',
    employeeId: 'EMP004',
  },
];

// Departments
export const mockDepartments: Department[] = [
  {
    id: 'd1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hodId: 'u3',
    description: 'Department of Computer Science and Engineering',
  },
  {
    id: 'd2',
    name: 'Electrical & Electronics Engineering',
    code: 'EEE',
    description: 'Department of Electrical and Electronics Engineering',
  },
  {
    id: 'd3',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Department of Mechanical Engineering',
  },
  {
    id: 'd4',
    name: 'Business Administration',
    code: 'MBA',
    description: 'School of Business Administration',
  },
];

// Courses
export const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'Bachelor of Technology in Computer Science',
    code: 'BTech-CS',
    totalDuration: '4 Years', // in years
    totalFees: 450000,
    courseType: 'B.Tech (CS)',
    credits: 160,
    description: '4-year undergraduate program in Computer Science',
  },
  {
    id: 'c2',
    name: 'Bachelor of Technology in Electrical Engineering',
    code: 'BTech-EE',
    totalDuration: '4 Years',
    totalFees: 420000,
    courseType: 'B.Tech (EE)',
    credits: 160,
  },
  {
    id: 'c3',
    name: 'Master of Business Administration',
    code: 'MBA',
    totalDuration: '2 Years',
    totalFees: 300000,
    courseType: 'MBA',
    credits: 120,
  },
  {
    id: 'c4',
    name: 'Bachelor of Computer Applications',
    code: 'BCA',
    totalDuration: '3 Years',
    totalFees: 250000,
    courseType: 'BCA',
    credits: 140,
  },
];

// Subjects
export const mockSubjects: Subject[] = [
  {
    id: 's1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    courseId: 'c1',
    semester: 3,
    credits: 4,
    facultyId: 'u3',
  },
  {
    id: 's2',
    name: 'Database Management Systems',
    code: 'CS202',
    courseId: 'c1',
    semester: 3,
    credits: 4,
    facultyId: 'u3',
  },
  {
    id: 's3',
    name: 'Operating Systems',
    code: 'CS203',
    courseId: 'c1',
    semester: 4,
    credits: 4,
  },
  {
    id: 's4',
    name: 'Computer Networks',
    code: 'CS204',
    courseId: 'c1',
    semester: 5,
    credits: 3,
  },
];

// Batches
export const mockBatches: Batch[] = [
  {
    id: 'b1',
    courseId: 'c1',
    year: 2023,
    semester: 3,
    startDate: '2024-07-01',
    endDate: '2024-12-31',
  },
  {
    id: 'b2',
    courseId: 'c1',
    year: 2024,
    semester: 1,
    startDate: '2024-07-01',
    endDate: '2024-12-31',
  },
];

// Attendance
export const mockAttendance: Attendance[] = [
  {
    id: 'a1',
    studentId: 'u2',
    subjectId: 's1',
    date: '2026-02-01',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a2',
    studentId: 'u2',
    subjectId: 's2',
    date: '2026-02-01',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a3',
    studentId: 'u2',
    subjectId: 's1',
    date: '2026-02-02',
    status: 'absent',
    markedBy: 'u3',
  },
  {
    id: 'a4',
    studentId: 'u2',
    subjectId: 's2',
    date: '2026-02-02',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a5',
    studentId: 'u2',
    subjectId: 's1',
    date: '2026-01-15',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a6',
    studentId: 'u2',
    subjectId: 's2',
    date: '2026-01-15',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a7',
    studentId: 'u2',
    subjectId: 's1',
    date: '2025-12-10',
    status: 'present',
    markedBy: 'u3',
  },
  {
    id: 'a8',
    studentId: 'u2',
    subjectId: 's2',
    date: '2025-12-10',
    status: 'absent',
    markedBy: 'u3',
  },
];

// Examinations
export const mockExaminations: Examination[] = [
  {
    id: 'e1',
    name: 'Mid Semester Examination',
    subjectId: 's1',
    date: '2026-03-15',
    startTime: '10:00',
    endTime: '13:00',
    totalMarks: 100,
    passingMarks: 40,
    type: 'midterm',
  },
  {
    id: 'e2',
    name: 'End Semester Examination',
    subjectId: 's1',
    date: '2026-05-20',
    startTime: '10:00',
    endTime: '13:00',
    totalMarks: 100,
    passingMarks: 40,
    type: 'final',
  },
];

// Results
export const mockResults: Result[] = [
  {
    id: 'r1',
    studentId: 'u2',
    examinationId: 'e1',
    marksObtained: 85,
    grade: 'A',
    status: 'pass',
  },
];

// Fee Structures
export const mockFeeStructures: FeeStructure[] = [
  {
    id: 'f1',
    courseId: 'c1',
    semester: 1,
    tuitionFee: 60000,
    libraryFee: 5000,
    examFee: 3000,
    otherFees: 7000,
    total: 75000,
  },
  {
    id: 'f2',
    courseId: 'c1',
    semester: 3,
    tuitionFee: 60000,
    libraryFee: 5000,
    examFee: 3000,
    otherFees: 7000,
    total: 75000,
  },
];

// Fee Payments
export const mockFeePayments: FeePayment[] = [
  {
    id: 'fp1',
    studentId: 'u2',
    feeStructureId: 'f2',
    amount: 75000,
    paymentDate: '2024-07-10',
    paymentMode: 'online',
    transactionId: 'TXN123456789',
    status: 'paid',
    receiptNumber: 'REC2024001',
  },
];

// Books
export const mockBooks: Book[] = [
  {
    id: 'bk1',
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson, Rivest, Stein',
    isbn: '978-0262033848',
    publisher: 'MIT Press',
    category: 'Computer Science',
    totalCopies: 15,
    availableCopies: 12,
    shelfLocation: 'A-101',
  },
  {
    id: 'bk2',
    title: 'Database System Concepts',
    author: 'Silberschatz, Korth, Sudarshan',
    isbn: '978-0073523323',
    publisher: 'McGraw Hill',
    category: 'Computer Science',
    totalCopies: 10,
    availableCopies: 8,
    shelfLocation: 'A-105',
  },
  {
    id: 'bk3',
    title: 'Operating System Concepts',
    author: 'Silberschatz, Galvin, Gagne',
    isbn: '978-1118063330',
    publisher: 'Wiley',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 9,
    shelfLocation: 'A-110',
  },
];

// Book Issues
export const mockBookIssues: BookIssue[] = [
  {
    id: 'bi1',
    bookId: 'bk1',
    userId: 'u2',
    issueDate: '2026-01-15',
    dueDate: '2026-02-15',
    fine: 0,
    status: 'issued',
  },
];

// Notices
export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Mid Semester Examination Schedule',
    content: 'The mid-semester examinations will be conducted from March 15-25, 2026. Students are advised to check the detailed schedule on the portal.',
    category: 'examination',
    publishedBy: 'u4',
    date: '2026-01-25',
    expiryDate: '2026-03-25',
    targetRoles: ['student', 'faculty'],
  },
  {
    id: 'n2',
    title: 'Fee Payment Deadline Extended',
    content: 'The last date for fee payment has been extended to February 20, 2026. Students can pay fees online or offline.',
    category: 'urgent',
    publishedBy: 'u5',
    date: '2026-01-28',
    expiryDate: '2026-02-20',
    targetRoles: ['student'],
  },
  {
    id: 'n3',
    title: 'Annual Technical Fest - TechVista 2026',
    content: 'The annual technical festival TechVista 2026 will be held from March 5-7. Registration is now open!',
    category: 'event',
    publishedBy: 'u1',
    date: '2026-01-20',
    expiryDate: '2026-03-07',
    targetRoles: ['student', 'faculty', 'admin'],
  },
];

// Timetable
export const mockTimetable: TimetableEntry[] = [
  {
    id: 't1',
    subjectId: 's1',
    facultyId: 'u3',
    batchId: 'b1',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:00',
    roomNumber: 'Room 301',
  },
  {
    id: 't2',
    subjectId: 's2',
    facultyId: 'u3',
    batchId: 'b1',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:00',
    roomNumber: 'Room 301',
  },
  {
    id: 't3',
    subjectId: 's1',
    facultyId: 'u3',
    batchId: 'b1',
    dayOfWeek: 3, // Wednesday
    startTime: '11:00',
    endTime: '12:00',
    roomNumber: 'Room 302',
  },
];

// Study Materials
export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: 'sm1',
    title: 'Introduction to Data Structures - Lecture Notes',
    subjectId: 's1',
    uploadedBy: 'u3',
    uploadDate: '2026-01-10',
    type: 'pdf',
    url: '#',
    description: 'Comprehensive lecture notes covering basic data structures',
  },
  {
    id: 'sm2',
    title: 'Sorting Algorithms Video Tutorial',
    subjectId: 's1',
    uploadedBy: 'u3',
    uploadDate: '2026-01-15',
    type: 'video',
    url: '#',
    description: 'Video explanation of various sorting algorithms',
  },
];

// Analytics
export const mockAnalytics: AnalyticsData = {
  totalStudents: 1580,
  totalFaculty: 156,
  totalDepartments: 12,
  totalCourses: 45,
  totalAccountant: 5,
  totalRevenue: 11850000,
  pendingFees: 2340000,
  totalBooks: 15420,
};
