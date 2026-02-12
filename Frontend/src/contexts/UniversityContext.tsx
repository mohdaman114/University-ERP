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
  mockAnalytics,
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
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
  const [users, setUsers] = useState<User[]>(mockUsers);

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
