import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  department?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  enrollmentNumber: string;
  branch?: string;
  semester?: number;
  admissionYear: number; // Made admissionYear required
}

export function AttendancePage() {  
  const { authenticatedFetch } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  
  // Filters
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(''); // New state for year
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', credits: 3, department: '' });
  const [subjectToDeleteId, setSubjectToDeleteId] = useState<string>('');

  // Get unique branches and semesters for filters
  const uniqueBranches = Array.from(new Set(students.map(s => s.branch).filter(Boolean)));
  const uniqueSemesters = Array.from(new Set(students.map(s => s.semester).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set(students.map(s => s.admissionYear).filter(Boolean))).sort(); // New: Get unique years

  // Filtered students
  const filteredStudents = students.filter(student => {
      const matchBranch = selectedBranch ? student.branch === selectedBranch : true;
      const matchSemester = selectedSemester ? student.semester?.toString() === selectedSemester : true;
      const matchYear = selectedYear ? student.admissionYear?.toString() === selectedYear : true; // New: Match year
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = searchTerm 
          ? (student.name.toLowerCase().includes(searchLower) || 
             student.studentId.toLowerCase().includes(searchLower))
          : true;
      return matchBranch && matchSemester && matchYear && matchSearch; // Include matchYear
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedSemester) queryParams.append('semester', selectedSemester);
        if (selectedYear) queryParams.append('year', selectedYear);

        const studentsResponse = await authenticatedFetch(`/api/faculty/students?${queryParams.toString()}`);
        const subjectsResponse = await authenticatedFetch('/api/faculty/subjects');

        if (!studentsResponse.ok) throw new Error(`HTTP error! status: ${studentsResponse.status} for students`);
        if (!subjectsResponse.ok) throw new Error(`HTTP error! status: ${subjectsResponse.status} for subjects`);

        const studentsData = await studentsResponse.json();
        const subjectsData = await subjectsResponse.json();

        setStudents(studentsData);
        setSubjects(subjectsData);
        
        // Default to first subject if available
        if (subjectsData.length > 0) {
          setSelectedSubjectId(subjectsData[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load student or subject data.');
        toast.error('Failed to load student or subject data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticatedFetch, selectedSemester, selectedYear]); // Add selectedSemester and selectedYear to dependencies

  const [attendance, setAttendance] = useState<{ [studentId: string]: { [subjectId: string]: 'present' | 'absent' | undefined } }>({});

  useEffect(() => {
    if (students.length > 0 && subjects.length > 0) {
        const initialAttendance: { [studentId: string]: { [subjectId: string]: 'present' | 'absent' | undefined } } = {};
        students.forEach((student: Student) => {
          initialAttendance[student._id] = {};
          subjects.forEach((subject: Subject) => {
            initialAttendance[student._id][subject._id] = undefined; 
          });
        });
        setAttendance(initialAttendance);
    }
  }, [students, subjects]);

  const handleMarkAttendance = async (studentId: string, subjectId: string, status: 'present' | 'absent') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await authenticatedFetch('/api/faculty/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, subject: subjectId, date: today, status }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setAttendance(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subjectId]: status,
        },
      }));
      toast.success(`Attendance marked as ${status}`);
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      toast.error('Failed to mark attendance.');
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSubjectForm({ name: '', code: '', credits: 3, department: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    const subject = subjects.find(s => s._id === selectedSubjectId);
    if (!subject) return;
    setModalMode('edit');
    setSubjectForm({ 
        name: subject.name, 
        code: subject.code, 
        credits: subject.credits,
        department: subject.department || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const url = modalMode === 'create' 
            ? '/api/faculty/subjects' 
            : `/api/faculty/subjects/${selectedSubjectId}`;
        const method = modalMode === 'create' ? 'POST' : 'PUT';
        
        const response = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subjectForm)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save subject');
        }

        const savedSubject = await response.json();
        
        if (modalMode === 'create') {
            setSubjects([...subjects, savedSubject]);
            setSelectedSubjectId(savedSubject._id);
            toast.success('Subject created successfully');
        } else {
            setSubjects(subjects.map(s => s._id === savedSubject._id ? savedSubject : s));
            toast.success('Subject updated successfully');
        }
        setIsModalOpen(false);
    } catch (err: any) {
        console.error('Error saving subject:', err);
        toast.error(err.message || 'Failed to save subject');
    }
  };

  const handleOpenDeleteModal = () => {
      setSubjectToDeleteId(selectedSubjectId);
      setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteSubject = async () => {
      if (!subjectToDeleteId) return;

      try {
          const response = await authenticatedFetch(`/api/faculty/subjects/${subjectToDeleteId}`, {
              method: 'DELETE'
          });

          if (!response.ok) throw new Error('Failed to delete subject');

          const newSubjects = subjects.filter(s => s._id !== subjectToDeleteId);
          setSubjects(newSubjects);
          
          // If the deleted subject was selected, select the first available one or clear
          if (selectedSubjectId === subjectToDeleteId) {
              setSelectedSubjectId(newSubjects.length > 0 ? newSubjects[0]._id : '');
          }
          
          toast.success('Subject deleted successfully');
          setIsDeleteModalOpen(false);
      } catch (err) {
          console.error('Error deleting subject:', err);
          toast.error('Failed to delete subject');
      }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Attendance</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Attendance</h1>
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full py-10 px-4 relative"
    >
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Attendance Management</h1>
      
      {/* Subject Management Controls */}
      <div className="flex flex-col gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {/* Top Row: Subject Selection and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">Select Subject:</label>
                  <select 
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      {subjects.length === 0 && <option value="">No subjects found</option>}
                      {subjects.map(subject => (
                          <option key={subject._id} value={subject._id}>
                              {subject.name} ({subject.code})
                          </option>
                      ))}
                  </select>
              </div>
              
              <div className="flex gap-2">
                  <button 
                      onClick={handleOpenCreateModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                      + Add Subject
                  </button>
                  {selectedSubjectId && (
                      <>
                          <button 
                              onClick={handleOpenEditModal}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                              Edit
                          </button>
                          <button 
                              onClick={handleOpenDeleteModal}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                              Delete
                          </button>
                      </>
                  )}
              </div>
          </div>

          {/* Bottom Row: Student Filters */}
          <div className="flex flex-wrap items-center gap-6 border-t pt-4 dark:border-gray-700">
              <div className="flex items-center gap-2">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">Search:</label>
                  <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name or Student ID"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white min-w-[200px]"
                  />
              </div>

              <div className="flex items-center gap-2">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">Filter by Branch:</label>
                  <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white min-w-[150px]"
                  >
                      <option value="">All Branches</option>
                      {uniqueBranches.map((branch: any) => (
                          <option key={branch} value={branch}>{branch}</option>
                      ))}
                  </select>
              </div>

              <div className="flex items-center gap-2">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">Filter by Semester:</label>
                  <select 
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white min-w-[150px]"
                  >
                      <option value="">All Semesters</option>
                      {uniqueSemesters.map((sem: any) => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                  </select>
              </div>

              <div className="flex items-center gap-2">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">Filter by Year:</label>
                  <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white min-w-[150px]"
                  >
                      <option value="">All Years</option>
                      {uniqueYears.map((year: any) => (
                          <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
              </div>
              
              {(selectedBranch || selectedSemester || searchTerm) && (
                  <button 
                      onClick={() => { setSelectedBranch(''); setSelectedSemester(''); setSearchTerm(''); }}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                      Clear Filters
                  </button>
              )}
          </div>
      </div>

      {students.length === 0 ? (
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">No student data available.</p>
      ) : (
        selectedSubjectId ? (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="py-3 px-6">Student Name</th>
                    <th scope="col" className="py-3 px-6">Student ID</th>
                    <th scope="col" className="py-3 px-6">Branch</th>
                    <th scope="col" className="py-3 px-6">Semester</th>
                    <th scope="col" className="py-3 px-6 text-center">Mark Attendance</th>
                </tr>
                </thead>
                <tbody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                    <tr key={student._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {student.name}
                    </th>
                    <td className="py-4 px-6">{student.studentId}</td>
                    <td className="py-4 px-6">{student.branch || 'N/A'}</td>
                    <td className="py-4 px-6">{student.semester || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                        <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => handleMarkAttendance(student._id, selectedSubjectId, 'present')}
                            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                            attendance[student._id]?.[selectedSubjectId] === 'present'
                                ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-300'
                                : 'bg-green-400 hover:bg-green-500'
                            }`}
                        >
                            Present
                        </button>
                        <button
                            onClick={() => handleMarkAttendance(student._id, selectedSubjectId, 'absent')}
                            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                            attendance[student._id]?.[selectedSubjectId] === 'absent'
                                ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-300'
                                : 'bg-red-400 hover:bg-red-500'
                            }`}
                        >
                            Absent
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                            No students found matching the selected filters.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        ) : (
            <p className="text-center text-gray-500 mt-10">Please select or create a subject to mark attendance.</p>
        )
      )}

      {/* Modal for Delete Subject */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      Delete Subject
                  </h2>
                  <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Select the subject you want to delete. This action cannot be undone.
                      </p>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                          Select Subject to Delete
                      </label>
                      <select 
                          value={subjectToDeleteId}
                          onChange={(e) => setSubjectToDeleteId(e.target.value)}
                          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                          {subjects.map(subject => (
                              <option key={subject._id} value={subject._id}>
                                  {subject.name} ({subject.code})
                              </option>
                          ))}
                      </select>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                      <button 
                          type="button" 
                          onClick={() => setIsDeleteModalOpen(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          type="button" 
                          onClick={handleConfirmDeleteSubject}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                          Confirm Delete
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Modal for Create/Edit Subject */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {modalMode === 'create' ? 'Add New Subject' : 'Edit Subject'}
                  </h2>
                  <form onSubmit={handleSubmitSubject}>
                      <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Name</label>
                          <input 
                              type="text" 
                              required
                              value={subjectForm.name}
                              onChange={e => setSubjectForm({...subjectForm, name: e.target.value})}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Code</label>
                          <input 
                              type="text" 
                              required
                              value={subjectForm.code}
                              onChange={e => setSubjectForm({...subjectForm, code: e.target.value})}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Credits</label>
                          <input 
                              type="number" 
                              required
                              min="1"
                              max="10"
                              value={subjectForm.credits}
                              onChange={e => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                      </div>
                      <div className="mb-6">
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Department (Optional)</label>
                          <input 
                              type="text" 
                              value={subjectForm.department}
                              onChange={e => setSubjectForm({...subjectForm, department: e.target.value})}
                              placeholder="e.g. Computer Science"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                          <button 
                              type="button" 
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit" 
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                              Save
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </motion.div>
  );
}
  