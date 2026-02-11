import React from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui-components';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Temporary data for notices
const temporaryNotices = [
  {
    id: '1',
    title: 'Important: Semester Break Schedule',
    date: '2024-03-01',
    content: 'The university will be closed from March 10th to March 17th for semester break. All academic and administrative activities will resume on March 18th.',
    category: 'Academic',
  },
  {
    id: '2',
    title: 'Career Fair 2024 - Registration Open',
    date: '2024-02-28',
    content: 'Students interested in participating in the annual Career Fair are advised to register by March 5th. Various companies will be recruiting for internships and full-time positions.',
    category: 'Events',
  },
  {
    id: '3',
    title: 'Library Maintenance Announcement',
    date: '2024-02-25',
    content: 'The main library will undergo routine maintenance on March 8th. Services may be temporarily interrupted. Please plan your visits accordingly.',
    category: 'General',
  },
  {
    id: '4',
    title: 'Scholarship Application Deadline Extended',
    date: '2024-02-20',
    content: 'The deadline for submitting scholarship applications for the upcoming academic year has been extended to March 15th. Don\'t miss this opportunity!',
    category: 'Scholarships',
  },
];

export function NoticePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with the latest announcements.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temporaryNotices.map((notice) => (
          <motion.div key={notice.id} variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>{notice.title}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>{notice.date}</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {notice.category}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{notice.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
