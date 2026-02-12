import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground border",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
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

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="separator"
      className={cn("bg-border shrink-0 h-px w-full", className)}
      {...props}
    />
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">StyleHub</h3>
            <p className="text-sm mb-4">
              Your trusted destination for premium clothing and fashion. 
              Quality guaranteed with fast shipping across India.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Products</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Categories</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Special Offers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Track Order</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Blog</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Shipping Information</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Warranty Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:support@stylehub.com" className="hover:text-white transition">
                  support@stylehub.com
                </a>
              </li>
            </ul>
            
            <div>
              <h5 className="text-white font-semibold text-sm mb-2">Newsletter</h5>
              <p className="text-xs mb-3">Subscribe to get special offers and updates</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button size="icon" className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2024 StyleHub. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
            <a href="#" className="hover:text-white transition">Refund Policy</a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400">We Accept</p>
            <div className="flex gap-4 items-center flex-wrap justify-center">
              <div className="bg-white rounded px-3 py-1.5 text-gray-900 font-semibold text-xs">VISA</div>
              <div className="bg-white rounded px-3 py-1.5 text-gray-900 font-semibold text-xs">MASTERCARD</div>
              <div className="bg-white rounded px-3 py-1.5 text-gray-900 font-semibold text-xs">UPI</div>
              <div className="bg-white rounded px-3 py-1.5 text-gray-900 font-semibold text-xs">PAYTM</div>
              <div className="bg-white rounded px-3 py-1.5 text-gray-900 font-semibold text-xs">COD</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
