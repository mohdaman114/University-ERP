import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { X, Play } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const campusImages = [
  'https://images.unsplash.com/photo-1655543274920-06de452d0d02?w=800',
  'https://images.unsplash.com/photo-1679653226697-2b0fbf7c17f7?w=800',
  'https://images.unsplash.com/photo-1632834380561-d1e05839a33a?w=800',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
];

const eventsImages = [
  'https://images.unsplash.com/photo-1660485345088-c398363c1f45?w=800',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
];

const labImages = [
  'https://images.unsplash.com/photo-1612773085209-476549690cd7?w=800',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800',
];

const sportsImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
];

const videos = [
  {
    title: 'Campus Tour 2026',
    thumbnail: 'https://images.unsplash.com/photo-1655543274920-06de452d0d02?w=800',
    duration: '5:32',
  },
  {
    title: 'Convocation Highlights',
    thumbnail: 'https://images.unsplash.com/photo-1660485345088-c398363c1f45?w=800',
    duration: '8:45',
  },
  {
    title: 'Research Excellence',
    thumbnail: 'https://images.unsplash.com/photo-1612773085209-476549690cd7?w=800',
    duration: '6:20',
  },
  {
    title: 'Student Life',
    thumbnail: 'https://images.unsplash.com/photo-1632834380561-d1e05839a33a?w=800',
    duration: '4:15',
  },
];

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              Gallery
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Campus Gallery
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore our vibrant campus life through images and videos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="campus" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="campus">Campus</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            {/* Campus Images */}
            <TabsContent value="campus" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {campusImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                      <ImageWithFallback
                        src={image}
                        alt={`Campus ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Events Images */}
            <TabsContent value="events" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {eventsImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                      <ImageWithFallback
                        src={image}
                        alt={`Event ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Lab Images */}
            <TabsContent value="labs" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {labImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                      <ImageWithFallback
                        src={image}
                        alt={`Lab ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Sports Images */}
            <TabsContent value="sports" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sportsImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                      <ImageWithFallback
                        src={image}
                        alt={`Sports ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Videos */}
            <TabsContent value="videos" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      <div className="relative">
                        <ImageWithFallback
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-4 right-4 bg-black/60 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{video.title}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
