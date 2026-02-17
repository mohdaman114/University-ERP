import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BellRing, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge 
} from '../admin-pages/AdminUI';

interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

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

export function NoticePage() {
  const { authenticatedFetch, user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        // Using the same endpoint as students/admin, which returns all notices
        // The backend route has been updated to allow 'faculty' role
        const response = await authenticatedFetch('/api/notices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }

        const data = await response.json();
        setNotices(data);
      } catch (err) {
        console.error('Error fetching notices:', err);
        setError('Failed to load notices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotices();
    }
  }, [authenticatedFetch, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500 gap-2">
        <AlertCircle className="h-8 w-8" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BellRing className="h-8 w-8 text-blue-600" />
          Notices & Announcements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Stay updated with the latest university announcements and circulars.
        </p>
      </motion.div>

      {notices.length === 0 ? (
        <motion.div variants={item} className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No notices available at the moment.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {notices.map((notice) => (
            <motion.div key={notice._id} variants={item}>
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{notice.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(notice.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {notice.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {notice.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
