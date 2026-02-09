import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from '@/contexts/AuthContext';
import { useUniversity } from '@/contexts/UniversityContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- UI Components ---

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
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

export function StudentDashboard({ currentPage }: { currentPage: string }) {
    const { user } = useAuth();
    const {
      subjects,
      attendance,
      results,
      feePayments,
      feeStructures,
      timetable,
      studyMaterials,
      examinations,
      bookIssues,
      books,
      notices,
    } = useUniversity();
  
    const getTabValue = (page: string) => {
      switch (page) {
        case 'dashboard':
          return 'overview';
        case 'attendance':
          return 'attendance';
        case 'examinations':
          return 'results'; // Assuming examinations results are shown in results tab
        case 'results':
          return 'results';
        case 'timetable':
          return 'timetable';
        case 'notices':
          return 'notices';
        case 'fees':
          return 'overview'; // No dedicated tab, show in overview
        case 'library':
          return 'overview'; // No dedicated tab, show in overview
        case 'materials':
          return 'overview'; // No dedicated tab, show in overview
        default:
          return 'overview';
      }
    };
  
    const [activeTab, setActiveTab] = React.useState(getTabValue(currentPage));
  
    React.useEffect(() => {
      setActiveTab(getTabValue(currentPage));
    }, [currentPage]);

  // Calculate statistics
  const totalClasses = attendance.filter(a => a.studentId === user?.id).length * 5; // Approximate
  const presentClasses = attendance.filter(a => a.studentId === user?.id && a.status === 'present').length * 5;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  const studentResults = results.filter(r => r.studentId === user?.id);
  const averageMarks = studentResults.length > 0
    ? studentResults.reduce((sum, r) => sum + r.marksObtained, 0) / studentResults.length
    : 0;

  const studentPayments = feePayments.filter(p => p.studentId === user?.id);
  const totalFeesPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalFeesRequired = feeStructures.reduce((sum, f) => sum + f.total, 0);
  const pendingFees = totalFeesRequired - totalFeesPaid;

  const studentBookIssues = bookIssues.filter(bi => bi.userId === user?.id && bi.status === 'issued');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening with your academics today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardDescription>Attendance</CardDescription>
            <CardTitle className="text-3xl">{attendancePercentage.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendancePercentage} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {presentClasses} / {totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{averageMarks.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={averageMarks} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {studentResults.length} exams completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-600">
          <CardHeader className="pb-2">
            <CardDescription>Pending Fees</CardDescription>
            <CardTitle className="text-3xl">₹{pendingFees.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Paid: ₹{totalFeesPaid.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardDescription>Books Issued</CardDescription>
            <CardTitle className="text-3xl">{studentBookIssues.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Active borrowings
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Exams */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Examinations</CardTitle>
                  <CardDescription>Your scheduled exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {examinations.slice(0, 3).map((exam) => {
                      const subject = subjects.find(s => s.id === exam.subjectId);
                      return (
                        <div key={exam.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{subject?.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(exam.date).toLocaleDateString()} • {exam.startTime}
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              {exam.type}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Study Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Study Materials</CardTitle>
                  <CardDescription>Latest uploads from faculty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyMaterials.slice(0, 3).map((material) => {
                      const subject = subjects.find(s => s.id === material.subjectId);
                      return (
                        <div key={material.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{material.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subject?.name}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {material.type.toUpperCase()}
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Details</CardTitle>
                <CardDescription>Subject-wise attendance record</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Total Classes</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => {
                      const subjectAttendance = attendance.filter(
                        a => a.studentId === user?.id && a.subjectId === subject.id
                      );
                      const total = subjectAttendance.length * 5;
                      const present = subjectAttendance.filter(a => a.status === 'present').length * 5;
                      const absent = total - present;
                      const percentage = total > 0 ? (present / total) * 100 : 0;

                      return (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>{total}</TableCell>
                          <TableCell className="text-green-600">{present}</TableCell>
                          <TableCell className="text-red-600">{absent}</TableCell>
                          <TableCell>{percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            {percentage >= 75 ? (
                              <Badge className="bg-green-100 text-green-800">Good</Badge>
                            ) : percentage >= 65 ? (
                              <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Low</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Examination Results</CardTitle>
                <CardDescription>Your academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Examination</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentResults.map((result) => {
                      const exam = examinations.find(e => e.id === result.examinationId);
                      const subject = subjects.find(s => s.id === exam?.subjectId);

                      return (
                        <TableRow key={result.id}>
                          <TableCell>{exam?.name}</TableCell>
                          <TableCell className="font-medium">{subject?.name}</TableCell>
                          <TableCell>{result.marksObtained}</TableCell>
                          <TableCell>{exam?.totalMarks}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{result.grade}</Badge>
                          </TableCell>
                          <TableCell>
                            {result.status === 'pass' ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pass
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Fail
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Timetable</CardTitle>
                <CardDescription>Your class schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                    const daySchedule = timetable.filter(t => t.dayOfWeek === index + 1);

                    return (
                      <div key={day} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">{day}</h3>
                        <div className="space-y-2">
                          {daySchedule.length > 0 ? (
                            daySchedule.map((entry) => {
                              const subject = subjects.find(s => s.id === entry.subjectId);
                              return (
                                <div key={entry.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">{entry.startTime} - {entry.endTime}</span>
                                  <span className="text-sm">{subject?.name}</span>
                                  <Badge variant="outline" className="ml-auto">{entry.roomNumber}</Badge>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-gray-500">No classes scheduled</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices" className="space-y-4">
            {notices
              .filter(n => n.targetRoles.includes('student'))
              .map((notice) => (
                <Card key={notice.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{notice.title}</CardTitle>
                        <CardDescription>
                          Published on {new Date(notice.publishedDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          notice.category === 'urgent'
                            ? 'destructive'
                            : notice.category === 'examination'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {notice.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{notice.content}</p>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
