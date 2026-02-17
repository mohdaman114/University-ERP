import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import * as TabsPrimitive from "@radix-ui/react-tabs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Progress({
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

export function Tabs({
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

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

// --- UI Components ---

export function Card({ className, ...props }: React.ComponentProps<"div">) {
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

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  );
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative", className)} {...props}>{children}</div>;
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
}

export function Badge({ className, variant, ...props }: React.ComponentProps<"div"> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  };
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant || 'default'],
        className
      )}
      {...props}
    />
  );
}


