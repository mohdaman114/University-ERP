import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui-components';
import { useAuth } from '@/contexts/AuthContext';

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

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  category: string;
}

export function NoticePage() {
  const { user, authenticatedFetch } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/notices`); // Assuming a general notices endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch notices data.');
        }
        const data: Notice[] = await response.json();
        setNotices(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [user, authenticatedFetch]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with the latest announcements.</p>
      </motion.div>

      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading notices...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!isLoading && !error && notices.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No notices found.</p>
      )}

      {!isLoading && !error && notices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice: Notice) => (
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
      )}
    </motion.div>
  );
}
