import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../admin-pages/AdminUI';

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
  const { authenticatedFetch, user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setIsLoading(true);
        const response = await authenticatedFetch('/api/timetable/faculty');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }

        const data = await response.json();
        setTimetable(data);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError('Failed to load timetable. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTimetable();
    }
  }, [authenticatedFetch, user]);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const groupedTimetable = daysOrder.reduce((acc, day) => {
    const dayEntries = timetable.filter(entry => entry.day === day);
    if (dayEntries.length > 0) {
      acc[day] = dayEntries.sort((a, b) => a.time.localeCompare(b.time));
    }
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground">
          View your weekly teaching schedule and class timings.
        </p>
      </div>

      {Object.keys(groupedTimetable).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-20" />
            <p>No classes scheduled for you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {daysOrder.map(day => {
            const entries = groupedTimetable[day];
            if (!entries) return null;

            return (
              <div key={day} className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Badge variant="outline" className="text-base py-1 px-3">
                    {day}
                  </Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold text-primary">
                              {entry.subject}
                            </CardTitle>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {entry.time}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>{entry.course}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{entry.semester}</span>
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
      )}
    </div>
  );
}
