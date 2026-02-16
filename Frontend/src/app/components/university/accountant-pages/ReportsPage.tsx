import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../student-pages/ui-components';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View financial reports</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This page is under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">This page is coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
