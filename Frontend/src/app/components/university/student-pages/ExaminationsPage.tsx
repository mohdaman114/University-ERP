import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui-components';

export function ExaminationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-full p-6"
    >
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-gray-600 dark:text-gray-400">Coming Soon!</p>
          <p className="mt-4 text-gray-500 dark:text-gray-500">
            We're working hard to bring you the latest examination schedules and results.
            Please check back later.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
