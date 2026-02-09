import React from 'react';
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
  CheckCircle,
  Calendar,
  FileText,
  CreditCard,
  User,
  GraduationCap,
  ArrowRight,
  Download,
} from 'lucide-react';

const admissionSteps = [
  {
    step: 1,
    title: 'Online Registration',
    description: 'Fill the online application form with basic details',
    icon: User,
  },
  {
    step: 2,
    title: 'Document Upload',
    description: 'Upload required documents and certificates',
    icon: FileText,
  },
  {
    step: 3,
    title: 'Fee Payment',
    description: 'Pay the application fee online',
    icon: CreditCard,
  },
  {
    step: 4,
    title: 'Entrance Test',
    description: 'Appear for university entrance examination',
    icon: GraduationCap,
  },
  {
    step: 5,
    title: 'Admission Confirmation',
    description: 'Receive admission letter and confirm your seat',
    icon: CheckCircle,
  },
];

const importantDates = [
  { event: 'Application Start Date', date: 'January 15, 2026' },
  { event: 'Last Date to Apply', date: 'April 30, 2026' },
  { event: 'Entrance Test', date: 'May 15-20, 2026' },
  { event: 'Merit List Declaration', date: 'June 5, 2026' },
  { event: 'Counseling Dates', date: 'June 10-25, 2026' },
  { event: 'Classes Begin', date: 'July 1, 2026' },
];

const eligibilityCriteria = {
  undergraduate: [
    'Passed 10+2 or equivalent with minimum 60% marks',
    'Valid score in university entrance test or JEE/NEET',
    'Age: 17-25 years as on July 1, 2026',
    'Medical fitness certificate',
  ],
  postgraduate: [
    'Bachelor\'s degree in relevant field with minimum 55% marks',
    'Valid GATE/CAT/MAT score (for respective programs)',
    'Work experience preferred for MBA (not mandatory)',
    'English proficiency (TOEFL/IELTS for international students)',
  ],
  phd: [
    'Master\'s degree with minimum 60% marks or equivalent CGPA',
    'Valid UGC-NET/CSIR-NET/GATE score',
    'Research proposal submission required',
    'Interview by departmental committee',
  ],
};

const scholarships = [
  {
    name: 'Merit Scholarship',
    criteria: 'Top 10% students based on entrance test',
    amount: 'Up to 100% tuition fee waiver',
  },
  {
    name: 'Sports Scholarship',
    criteria: 'State/National level sports achievements',
    amount: 'Up to 50% tuition fee waiver',
  },
  {
    name: 'Need-Based Scholarship',
    criteria: 'Family income less than ₹6 lakhs/year',
    amount: 'Up to 75% tuition fee waiver',
  },
  {
    name: 'Research Fellowship',
    criteria: 'Ph.D students with CSIR/UGC-NET',
    amount: '₹31,000/month stipend',
  },
];

export function AdmissionsPage() {
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
              Admissions 2026-27
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Admissions Open
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join Excellence University and embark on your journey to success
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20" id="process">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Admission Process</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple 5-step process to secure your admission
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {admissionSteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {item.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 hidden md:block">
                          <item.icon className="h-10 w-10 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Important Dates</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Mark your calendar - don't miss these deadlines
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {importantDates.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Calendar className="h-10 w-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.event}</h3>
                      <p className="text-blue-600 font-medium">{item.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-20" id="eligibility">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Eligibility Criteria</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Check if you meet the requirements
            </p>
          </motion.div>

          <Tabs defaultValue="undergraduate" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
              <TabsTrigger value="phd">Ph.D</TabsTrigger>
            </TabsList>

            {Object.entries(eligibilityCriteria).map(([key, criteria]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <ul className="space-y-4">
                      {criteria.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-lg">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Scholarships</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Financial assistance for deserving students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">
                      {scholarship.amount}
                    </Badge>
                    <h3 className="text-xl font-bold mb-3">{scholarship.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {scholarship.criteria}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Apply?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Start your application today and take the first step towards your dream career
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Apply Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="mr-2 h-5 w-5" />
                Download Prospectus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
