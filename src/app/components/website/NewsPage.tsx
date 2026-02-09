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
import { Calendar, ArrowRight, Bell, Award, Users } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const news = [
  {
    title: 'Excellence University Wins National Innovation Award',
    date: 'January 28, 2026',
    category: 'Achievement',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    excerpt: 'Our university has been recognized for outstanding contributions to innovation and research.',
  },
  {
    title: 'New AI Research Center Inaugurated',
    date: 'January 25, 2026',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    excerpt: 'State-of-the-art AI and Machine Learning research facility opens its doors.',
  },
  {
    title: 'International Collaboration with MIT',
    date: 'January 20, 2026',
    category: 'Partnership',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    excerpt: 'Student exchange program and joint research initiatives announced.',
  },
  {
    title: 'Record Placement Season 2025-26',
    date: 'January 15, 2026',
    category: 'Placement',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    excerpt: '98% placement rate achieved with top companies visiting campus.',
  },
];

const events = [
  {
    title: 'Annual Convocation Ceremony',
    date: 'March 20, 2026',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    type: 'Academic',
  },
  {
    title: 'Tech Fest 2026',
    date: 'March 5-7, 2026',
    time: 'All Day',
    venue: 'Campus Wide',
    type: 'Festival',
  },
  {
    title: 'Guest Lecture by Industry Expert',
    date: 'February 15, 2026',
    time: '3:00 PM',
    venue: 'Conference Hall',
    type: 'Lecture',
  },
  {
    title: 'Sports Meet 2026',
    date: 'February 20-25, 2026',
    time: 'All Day',
    venue: 'Sports Complex',
    type: 'Sports',
  },
];

const notices = [
  {
    title: 'Mid-Semester Examination Schedule Released',
    date: 'January 30, 2026',
    urgent: true,
  },
  {
    title: 'Fee Payment Deadline Extended',
    date: 'January 28, 2026',
    urgent: true,
  },
  {
    title: 'Library Timing Change - February',
    date: 'January 25, 2026',
    urgent: false,
  },
  {
    title: 'Scholarship Application Open',
    date: 'January 20, 2026',
    urgent: false,
  },
];

export function NewsPage() {
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
              News & Events
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Latest Updates
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Stay informed about the latest news, events, and announcements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs for News, Events, Notices */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="news">Latest News</TabsTrigger>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="notices">Notices</TabsTrigger>
            </TabsList>

            {/* News Tab */}
            <TabsContent value="news" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {news.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge>{item.category}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {item.excerpt}
                        </p>
                        <Button variant="ghost" className="group-hover:text-blue-600">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="mt-8">
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0 text-center md:border-r md:pr-6">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-4 inline-block">
                              <div className="text-3xl font-bold">
                                {new Date(event.date.split(',')[0]).getDate()}
                              </div>
                              <div className="text-sm">
                                {new Date(event.date.split(',')[0]).toLocaleString('default', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-xl">{event.title}</h3>
                              <Badge>{event.type}</Badge>
                            </div>
                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                              <p className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {event.date} | {event.time}
                              </p>
                              <p className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {event.venue}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Notices Tab */}
            <TabsContent value="notices" className="mt-8">
              <div className="space-y-3">
                {notices.map((notice, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Bell className={`h-6 w-6 ${notice.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                {notice.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {notice.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {notice.urgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
