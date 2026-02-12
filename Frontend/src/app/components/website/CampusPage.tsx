import React from 'react';
import { motion } from 'motion/react';
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
import {
  BookOpen,
  Home,
  Dumbbell,
  Coffee,
  Wifi,
  Shield,
  Utensils,
  Bus,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const facilities = [
  {
    title: 'Central Library',
    description: '500,000+ books, 24/7 digital access, quiet study zones',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1752920299180-e8fd9276c202?w=800',
  },
  {
    title: 'Hostels',
    description: 'Separate boys & girls hostels with modern amenities',
    icon: Home,
    color: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
  },
  {
    title: 'Sports Complex',
    description: 'Olympic-size pool, indoor stadium, outdoor courts',
    icon: Dumbbell,
    color: 'from-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    title: 'Cafeteria & Food Courts',
    description: 'Multiple dining options with diverse cuisines',
    icon: Utensils,
    color: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
  },
];

const amenities = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Campus-wide connectivity',
  },
  {
    icon: Shield,
    title: '24/7 Security',
    description: 'CCTV surveillance & guards',
  },
  {
    icon: Bus,
    title: 'Transport Facility',
    description: 'Bus service to all areas',
  },
  {
    icon: Coffee,
    title: 'Student Lounges',
    description: 'Relaxation & recreation spaces',
  },
];

const hostelFeatures = [
  'Fully furnished single/double occupancy rooms',
  'Attached bathrooms with 24/7 water supply',
  'Common rooms with TV and indoor games',
  'Mess with nutritious meals (Veg & Non-veg)',
  'Laundry facilities',
  'Medical room with first-aid',
  'Strict security with biometric access',
  'Study rooms and libraries',
];

const sportsActivities = [
  'Cricket', 'Football', 'Basketball', 'Volleyball',
  'Table Tennis', 'Badminton', 'Swimming', 'Athletics',
  'Chess', 'Yoga & Fitness Center',
];

export function CampusPage() {
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
              Campus Life
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Life on Campus
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Experience vibrant campus life with world-class facilities and endless opportunities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Facilities */}
      <section className="py-20" id="facilities">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Campus Facilities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need for a enriching university experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <ImageWithFallback
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className={`bg-gradient-to-br ${facility.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <facility.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{facility.title}</h3>
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

      {/* Amenities */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <amenity.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-bold mb-2">{amenity.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {amenity.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Library Details */}
      <section className="py-20" id="library">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Central Library</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our state-of-the-art library is the heart of academic excellence, providing access to 
                vast resources and a conducive environment for learning.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <span>500,000+ physical books and journals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <span>Access to 10,000+ e-journals and databases</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <span>24/7 digital library access</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <span>Quiet reading rooms and group discussion areas</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1752920299180-e8fd9276c202?w=800"
                alt="Library"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hostel Details */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="hostels">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Hostel Facilities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your home away from home
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {hostelFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="py-20" id="sports">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Sports & Recreation</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Stay fit, stay active, stay competitive
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {sportsActivities.map((sport, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Badge className="text-base px-4 py-2">
                    {sport}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
