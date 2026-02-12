import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
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
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
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
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
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
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
import {
  BookOpen,
  GraduationCap,
  Microscope,
  Calculator,
  Palette,
  Briefcase,
  Download,
  ExternalLink,
} from 'lucide-react';

const faculties = [
  {
    name: 'Faculty of Engineering & Technology',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
  },
  {
    name: 'Faculty of Sciences',
    icon: Microscope,
    color: 'from-purple-500 to-pink-500',
    departments: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Environmental Science'],
  },
  {
    name: 'Faculty of Business & Management',
    icon: Briefcase,
    color: 'from-orange-500 to-red-500',
    departments: ['MBA', 'BBA', 'Finance', 'Marketing', 'HR Management'],
  },
  {
    name: 'Faculty of Arts & Humanities',
    icon: Palette,
    color: 'from-green-500 to-emerald-500',
    departments: ['English', 'History', 'Political Science', 'Sociology', 'Psychology'],
  },
];

const programs = {
  undergraduate: [
    {
      name: 'B.Tech in Computer Science',
      duration: '4 years',
      seats: '120',
      fee: '₹1,20,000/year',
    },
    {
      name: 'B.Sc in Physics',
      duration: '3 years',
      seats: '60',
      fee: '₹60,000/year',
    },
    {
      name: 'BBA',
      duration: '3 years',
      seats: '80',
      fee: '₹80,000/year',
    },
    {
      name: 'B.A in English',
      duration: '3 years',
      seats: '50',
      fee: '₹40,000/year',
    },
  ],
  postgraduate: [
    {
      name: 'M.Tech in AI & ML',
      duration: '2 years',
      seats: '40',
      fee: '₹1,50,000/year',
    },
    {
      name: 'MBA',
      duration: '2 years',
      seats: '100',
      fee: '₹2,00,000/year',
    },
    {
      name: 'M.Sc in Data Science',
      duration: '2 years',
      seats: '30',
      fee: '₹90,000/year',
    },
    {
      name: 'M.A in Psychology',
      duration: '2 years',
      seats: '25',
      fee: '₹50,000/year',
    },
  ],
  phd: [
    {
      name: 'Ph.D in Engineering',
      duration: '3-5 years',
      seats: '50',
      fee: '₹75,000/year',
    },
    {
      name: 'Ph.D in Sciences',
      duration: '3-5 years',
      seats: '40',
      fee: '₹60,000/year',
    },
    {
      name: 'Ph.D in Management',
      duration: '3-5 years',
      seats: '20',
      fee: '₹80,000/year',
    },
  ],
};

export function AcademicsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Academics
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Academic Programs
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore our comprehensive range of undergraduate, postgraduate, and doctoral programs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculties */}
      <section className="py-20" id="faculties">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Faculties</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Diverse academic faculties with world-class departments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {faculties.map((faculty, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className={`bg-gradient-to-br ${faculty.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                      <faculty.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{faculty.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {faculty.departments.map((dept, idx) => (
                        <Badge key={idx} variant="secondary">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="courses">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Programs Offered</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose from a wide range of academic programs
            </p>
          </motion.div>

          <Tabs defaultValue="undergraduate" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
              <TabsTrigger value="phd">Ph.D Programs</TabsTrigger>
            </TabsList>

            {Object.entries(programs).map(([key, programList]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {programList.map((program, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{program.duration}</Badge>
                                <Badge variant="outline">{program.seats} seats</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                {program.fee}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full">
                            View Details
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-20" id="syllabus">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Course Syllabus</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Download detailed syllabus for all programs
            </p>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Access comprehensive syllabus documents for all undergraduate and postgraduate programs
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download Syllabus (PDF)
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
