import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui-components';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, User, BookOpen } from 'lucide-react';

interface TimetableEntry {
  _id: string;
  course: string;
  semester: string;
  day: string;
  subject: string;
  time: string;
  faculty: string;
}

export function TimetablePage() {
  const { user, authenticatedFetch } = useAuth();
  const [timetableData, setTimetableData] = useState<TimetableEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Using the generic endpoint which determines student identity from token
        const response = await authenticatedFetch('/api/timetable');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timetable data.');
        }
        
        const data = await response.json();
        setTimetableData(data);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError('Failed to load timetable. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [user, authenticatedFetch]);

  // Group and sort timetable entries
  const groupedTimetable = React.useMemo(() => {
    if (!timetableData) return {};
    
    return timetableData.reduce((acc, entry) => {
      if (!acc[entry.day]) {
        acc[entry.day] = [];
      }
      acc[entry.day].push(entry);
      // Sort by time string (simple lexicographical sort usually works for HH:MM format)
      acc[entry.day].sort((a, b) => a.time.localeCompare(b.time));
      return acc;
    }, {} as Record<string, TimetableEntry[]>);
  }, [timetableData]);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!timetableData || timetableData.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Weekly Timetable</h2>
        <p>No classes scheduled for your course and semester yet.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Weekly Schedule</h2>
        <p className="text-gray-500 dark:text-gray-400">
          View your class timings and subjects for Semester {timetableData[0]?.semester}.
        </p>
      </div>

      <div className="grid gap-8">
        {daysOrder.map(day => {
          const entries = groupedTimetable[day];
          if (!entries || entries.length === 0) return null;

          return (
            <div key={day} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm uppercase tracking-wide">
                  {day}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map((entry) => (
                  <motion.div
                    key={entry._id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                            {entry.subject}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-xs font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 whitespace-nowrap shadow-sm">
                            <Clock className="h-3 w-3" />
                            {entry.time}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">{entry.faculty}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                          <span>{entry.course}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
