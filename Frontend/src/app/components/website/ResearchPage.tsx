import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Microscope,
  Rocket,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

const researchAreas = [
  {
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Advanced research in deep learning, neural networks, and intelligent systems',
    projects: 45,
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Renewable Energy',
    description: 'Sustainable energy solutions and green technology research',
    projects: 32,
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Biotechnology & Healthcare',
    description: 'Medical innovations and pharmaceutical research',
    projects: 28,
    icon: Microscope,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Quantum Computing',
    description: 'Next-generation computing and quantum algorithms',
    projects: 18,
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
  },
];

const publications = [
  {
    title: 'Machine Learning Applications in Healthcare',
    authors: 'Dr. Sharma et al.',
    journal: 'Nature Medicine',
    year: '2026',
    citations: 245,
  },
  {
    title: 'Quantum Algorithms for Optimization',
    authors: 'Prof. Kumar et al.',
    journal: 'Science',
    year: '2026',
    citations: 189,
  },
  {
    title: 'Sustainable Energy Storage Systems',
    authors: 'Dr. Patel et al.',
    journal: 'Energy & Environmental Science',
    year: '2025',
    citations: 156,
  },
];

const facilities = [
  {
    name: 'Advanced Computing Lab',
    description: 'High-performance computing clusters for AI/ML research',
  },
  {
    name: 'Biotechnology Research Center',
    description: 'State-of-the-art facilities for biological research',
  },
  {
    name: 'Innovation Hub',
    description: 'Collaborative space for interdisciplinary research',
  },
  {
    name: 'Central Library & Digital Repository',
    description: 'Access to millions of research papers and journals',
  },
];

export function ResearchPage() {
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
              Research & Innovation
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Pioneering Research
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Driving innovation and discovery through cutting-edge research
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, value: '3,500+', label: 'Research Papers' },
              { icon: Users, value: '500+', label: 'Researchers' },
              { icon: Award, value: '150+', label: 'Patents Filed' },
              { icon: TrendingUp, value: '₹120Cr', label: 'Research Funding' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Research Focus Areas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Leading research in cutting-edge technologies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className={`bg-gradient-to-br ${area.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                      <area.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {area.description}
                    </p>
                    <Badge>{area.projects} Active Projects</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Recent Publications</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Our latest contributions to global research
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {publications.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{pub.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {pub.authors}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant="secondary">{pub.journal}</Badge>
                          <Badge variant="outline">{pub.year}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {pub.citations} citations
                          </span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Research Facilities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              World-class infrastructure for groundbreaking research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3">{facility.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {facility.description}
                    </p>
                  </CardContent>
                </Card>
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

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

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
