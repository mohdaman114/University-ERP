import React from 'react';
import { Calendar, FileText, Users, Clock } from 'lucide-react';
import { useUniversity } from '@/contexts/UniversityContext';
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function ExaminationDashboard() {
  const { examinations, subjects } = useUniversity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Examination Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage examinations, schedules, and results
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Exams</CardDescription>
            <CardTitle className="text-3xl">{examinations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-3xl">
              {examinations.filter(e => new Date(e.date) > new Date()).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">
              {examinations.filter(e => new Date(e.date) < new Date()).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Examination Schedule</CardTitle>
          <CardDescription>All scheduled examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examinations.map((exam) => {
                const subject = subjects.find(s => s.id === exam.subjectId);
                const isUpcoming = new Date(exam.date) > new Date();
                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{subject?.name}</TableCell>
                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                    <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{exam.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AccountsDashboard() {
  const { feePayments, feeStructures, analytics } = useUniversity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Accounts Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Financial management and fee tracking
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">₹{(analytics.totalRevenue / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-yellow-600">
          <CardHeader>
            <CardDescription>Pending Fees</CardDescription>
            <CardTitle className="text-3xl">₹{(analytics.pendingFees / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <CardDescription>Total Payments</CardDescription>
            <CardTitle className="text-3xl">{feePayments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feePayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.paymentMode}</Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function LibraryDashboard() {
  const { books, bookIssues, analytics } = useUniversity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage books, issues, and returns
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Books</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalBooks.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Available</CardDescription>
            <CardTitle className="text-3xl">
              {books.reduce((sum, b) => sum + b.availableCopies, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Issued</CardDescription>
            <CardTitle className="text-3xl">
              {bookIssues.filter(bi => bi.status === 'issued').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {bookIssues.filter(bi => bi.status === 'overdue').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Inventory</CardTitle>
          <CardDescription>Available books in library</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Copies</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.category}</Badge>
                  </TableCell>
                  <TableCell>{book.totalCopies}</TableCell>
                  <TableCell>
                    <Badge
                      variant={book.availableCopies > 0 ? 'default' : 'destructive'}
                    >
                      {book.availableCopies}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
