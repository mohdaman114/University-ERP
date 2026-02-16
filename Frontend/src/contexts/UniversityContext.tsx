import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Department,
  Course,
  Subject,
  Batch,
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
  User,
  Accountant,
} from '@/types/university';
import {
  mockDepartments,
  mockCourses,
  mockSubjects,
  mockBatches,
  mockAttendance,
  mockExaminations,
  mockResults,
  mockFeeStructures,
  mockFeePayments,
  mockBooks,
  mockBookIssues,
  mockNotices,
  mockTimetable,
  mockStudyMaterials,
  mockUsers,
} from '@/data/mockData';

interface UniversityContextType {
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  batches: Batch[];
  attendance: Attendance[];
  examinations: Examination[];
  results: Result[];
  feeStructures: FeeStructure[];
  feePayments: FeePayment[];
  books: Book[];
  bookIssues: BookIssue[];
  notices: Notice[];
  timetable: TimetableEntry[];
  studyMaterials: StudyMaterial[];
  analytics: AnalyticsData;
  users: User[];
  accountants: Accountant[];
  
  // Update functions
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addAttendance: (attendance: Attendance) => void;
  addResult: (result: Result) => void;
  addFeePayment: (payment: FeePayment) => void;
  addBookIssue: (issue: BookIssue) => void;
  updateBookIssue: (id: string, issue: Partial<BookIssue>) => void;
  addStudyMaterial: (material: StudyMaterial) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [examinations, setExaminations] = useState<Examination[]>(mockExaminations);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(mockFeeStructures);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(mockFeePayments);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [bookIssues, setBookIssues] = useState<BookIssue[]>(mockBookIssues);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(mockTimetable);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [users, setUsers] = useState<User[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingFees: 0,
    totalAccountant: 0,
    totalBooks: 0, // Added missing property
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/notices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotices(data);
      } else {
        console.error('Fetched notices data is not an array:', data);
        setNotices([]);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      // Assuming students are also users, we can count them
      setAnalytics(prev => ({ ...prev, totalStudents: data.length }));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/faculty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch faculty');
      }
      const data = await response.json();
      setAnalytics(prev => ({ ...prev, totalFaculty: data.length }));
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const fetchAccountants = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/accountants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch accountants');
      }
      const data = await response.json();
      setAccountants(data);
      setAnalytics(prev => ({ ...prev, totalAccountant: data.length }));
    } catch (error) {
      console.error('Error fetching accountants:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/departments', { // Assuming a /api/admin/departments endpoint
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
      setAnalytics(prev => ({ ...prev, totalDepartments: data.length }));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/courses', { // Assuming a /api/admin/courses endpoint
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
      setAnalytics(prev => ({ ...prev, totalCourses: data.length }));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/admin/books', { // Assuming a /api/admin/books endpoint
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
      setAnalytics(prev => ({ ...prev, totalBooks: data.length }));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNotices();
    fetchStudents();
    fetchFaculty();
    fetchAccountants();
    fetchDepartments();
    fetchCourses();
    fetchBooks();
  }, []);

  // Notice functions
  const addNotice = (notice: Notice) => {
    setNotices(prev => [notice, ...prev]);
  };

  const updateNotice = (id: string, updatedNotice: Partial<Notice>) => {
    setNotices(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updatedNotice } : n))
    );
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Attendance functions
  const addAttendance = (newAttendance: Attendance) => {
    setAttendance(prev => [...prev, newAttendance]);
  };

  // Result functions
  const addResult = (result: Result) => {
    setResults(prev => [...prev, result]);
  };

  // Fee payment functions
  const addFeePayment = (payment: FeePayment) => {
    setFeePayments(prev => [...prev, payment]);
  };

  // Book issue functions
  const addBookIssue = (issue: BookIssue) => {
    setBookIssues(prev => [...prev, issue]);
    setBooks(prev =>
      prev.map(b =>
        b.id === issue.bookId
          ? { ...b, availableCopies: b.availableCopies - 1 }
          : b
      )
    );
  };

  const updateBookIssue = (id: string, updatedIssue: Partial<BookIssue>) => {
    setBookIssues(prev =>
      prev.map(bi => (bi.id === id ? { ...bi, ...updatedIssue } : bi))
    );
    
    // If book is returned, update available copies
    if (updatedIssue.status === 'returned') {
      const issue = bookIssues.find(bi => bi.id === id);
      if (issue) {
        setBooks(prev =>
          prev.map(b =>
            b.id === issue.bookId
              ? { ...b, availableCopies: b.availableCopies + 1 }
              : b
          )
        );
      }
    }
  };

  // Study material functions
  const addStudyMaterial = (material: StudyMaterial) => {
    setStudyMaterials(prev => [material, ...prev]);
  };

  return (
    <UniversityContext.Provider
      value={{
        departments,
        courses,
        subjects,
        batches,
        attendance,
        examinations,
        results,
        feeStructures,
        feePayments,
        books,
        bookIssues,
        notices,
        timetable,
        studyMaterials,
        analytics,
        users,
        accountants,
        addNotice,
        updateNotice,
        deleteNotice,
        addAttendance,
        addResult,
        addFeePayment,
        addBookIssue,
        updateBookIssue,
        addStudyMaterial,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within UniversityProvider');
  }
  return context;
}
