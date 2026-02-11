import React from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui-components'; // Added CardDescription

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room: string;
}

const bcaTimetable: TimetableEntry[] = [
  { day: 'Monday', time: '09:00 - 10:00', subject: 'Data Structures', room: 'LH-101' },
  { day: 'Monday', time: '10:00 - 11:00', subject: 'Discrete Mathematics', room: 'LH-102' },
  { day: 'Monday', time: '11:00 - 12:00', subject: 'Programming in C', room: 'Lab-A' },
  { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Operating Systems', room: 'LH-103' },
  { day: 'Tuesday', time: '10:00 - 11:00', subject: 'Computer Networks', room: 'LH-101' },
  { day: 'Tuesday', time: '11:00 - 12:00', subject: 'Web Technologies', room: 'Lab-B' },
  { day: 'Wednesday', time: '09:00 - 10:00', subject: 'Database Management', room: 'LH-102' },
  { day: 'Wednesday', time: '10:00 - 11:00', subject: 'Software Engineering', room: 'LH-103' },
  { day: 'Wednesday', time: '11:00 - 12:00', subject: 'Python Programming', room: 'Lab-A' },
  { day: 'Thursday', time: '09:00 - 10:00', subject: 'Artificial Intelligence', room: 'LH-101' },
  { day: 'Thursday', time: '10:00 - 11:00', subject: 'Cloud Computing', room: 'LH-102' },
  { day: 'Thursday', time: '11:00 - 12:00', subject: 'Mobile Application Dev', room: 'Lab-B' },
  { day: 'Friday', time: '09:00 - 10:00', subject: 'Cyber Security', room: 'LH-103' },
  { day: 'Friday', time: '10:00 - 11:00', subject: 'Project Management', room: 'LH-101' },
  { day: 'Friday', time: '11:00 - 12:00', subject: 'Seminar', room: 'Auditorium' },
];

export function TimetablePage() {
  // Group timetable entries by day
  const timetableByDay = bcaTimetable.reduce((acc, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    acc[entry.day].push(entry);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Timetable - BCA Course</h2>

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
