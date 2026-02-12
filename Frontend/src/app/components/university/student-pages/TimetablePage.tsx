import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui-components';
import { useAuth } from '@/contexts/AuthContext';

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room: string;
}

export function TimetablePage() {
  const { user, authenticatedFetch } = useAuth();
  const [timetableData, setTimetableData] = useState<TimetableEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await authenticatedFetch(`/api/students/${user.id}/timetable`);
        if (!response.ok) {
          throw new Error('Failed to fetch timetable data.');
        }
        const data: TimetableEntry[] = await response.json();
        setTimetableData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, [user, authenticatedFetch]);

  // Conditional rendering for loading, error, and no data states
  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h2>
        <p>Loading timetable...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h2>
        <p className="text-red-500">Error: {error}</p>
      </motion.div>
    );
  }

  if (!timetableData || timetableData.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h2>
        <p>No timetable found.</p>
      </motion.div>
    );
  }

  // Group timetable entries by day
  const timetableByDay = timetableData.reduce((acc, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    acc[entry.day].push(entry);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h2>

      {daysOrder.map(day => {
        const entries = timetableByDay[day];
        if (!entries || entries.length === 0) {
          return null;
        }
        return (
          <div key={day} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{day}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg">{entry.subject}</CardTitle>
                    <CardDescription>{entry.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Room: {entry.room}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
