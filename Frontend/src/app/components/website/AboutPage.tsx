import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Target,
  Eye,
  Award,
  Users,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const milestones = [
  { year: '1965', event: 'University Founded' },
  { year: '1985', event: 'Research Center Established' },
  { year: '2000', event: 'International Accreditation' },
  { year: '2015', event: 'Smart Campus Initiative' },
  { year: '2020', event: 'AI & Innovation Hub Launched' },
  { year: '2025', event: '60 Years of Excellence' },
];

const leadership = [
  {
    name: 'Dr. Rajesh Kumar',
    position: 'Vice Chancellor',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  },
  {
    name: 'Prof. Anjali Sharma',
    position: 'Pro Vice Chancellor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    name: 'Dr. Vikram Patel',
    position: 'Registrar',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  },
  {
    name: 'Prof. Meera Gupta',
    position: 'Dean of Academics',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

const values = [
  {
    title: 'Excellence',
    description: 'Striving for the highest standards in education and research',
    icon: Award,
  },
  {
    title: 'Innovation',
    description: 'Fostering creativity and pioneering new ideas',
    icon: TrendingUp,
  },
  {
    title: 'Integrity',
    description: 'Upholding ethics and transparency in all endeavors',
    icon: Target,
  },
  {
    title: 'Inclusivity',
    description: 'Creating an diverse and welcoming environment',
    icon: Users,
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About Excellence University
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              60 years of academic excellence, innovation, and transforming lives through education
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-none">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    To be a globally recognized institution of higher learning that inspires innovation, 
                    nurtures talent, and creates leaders who make a positive impact on society through 
                    excellence in education, research, and community service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-none">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    To provide world-class education that combines academic rigor with practical experience, 
                    foster groundbreaking research, promote critical thinking, and develop well-rounded 
                    individuals equipped to address global challenges and contribute to societal progress.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Six decades of educational excellence
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-24">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl px-4 py-2 rounded-lg text-center">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <Card>
                    <CardContent className="p-4">
                      <p className="font-semibold text-lg">{milestone.event}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Meet the visionaries guiding our institution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <ImageWithFallback
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-2">{leader.name}</h3>
                    <p className="text-blue-600 font-medium">{leader.position}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '25,000+', label: 'Students' },
              { value: '1,200+', label: 'Faculty' },
              { value: '50+', label: 'Countries' },
              { value: '95%', label: 'Placement Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// UI Components

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

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}
