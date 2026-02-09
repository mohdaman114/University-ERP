import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// --- UI Components ---

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button
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

// Input
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

// ScrollArea
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

// Avatar
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const aiResponses: Record<string, string> = {
  admission: 'For admissions, please visit our Admissions page or click here to apply online. The admission process typically starts in January for the 2026-27 session. Undergraduate programs require 60% in 10+2, postgraduate programs need 55% in Bachelor\'s degree. You can also contact admissions@excellenceuniv.edu.in or call +91 11 1234 5679.',
  course: 'We offer various undergraduate, postgraduate, and Ph.D programs in Engineering, Sciences, Business & Management, and Arts & Humanities. Popular courses include B.Tech Computer Science, MBA, M.Tech AI & ML, and various B.Sc programs. Visit our Academics page for the complete list of programs.',
  fee: 'Fee structures vary by course and level. For example: B.Tech courses are ₹1,20,000/year, MBA is ₹2,00,000/year, and Ph.D programs start at ₹75,000/year. We also offer merit-based, sports, and need-based scholarships up to 100% fee waiver. Visit the Admissions page for detailed fee information.',
  exam: 'Examination schedules are available in the News & Events section and the Examination module in ERP. Mid-semester exams are typically in March, and end-semester exams in May/November. Students can download hall tickets 10 days before exams from the student portal.',
  attendance: 'You can view your attendance in the Student Dashboard after logging into the ERP portal. Minimum 75% attendance is required to appear for examinations. For attendance-related queries, contact your class coordinator through the ERP system.',
  timetable: 'Your class timetable is available in the Student Dashboard under the Timetable section in ERP. Classes are scheduled from Monday to Friday, 9:00 AM to 5:00 PM. For changes or conflicts, contact the Academic Office.',
  library: 'Our Central Library has 500,000+ books, 24/7 digital access, and is open from 9:00 AM to 8:00 PM on weekdays and 9:00 AM to 5:00 PM on weekends. Students can borrow up to 3 books for 30 days. Access the library portal through the ERP system or visit the Campus Life page.',
  result: 'Examination results are published within 30 days after exams and can be checked in the Student Dashboard in ERP. For revaluation or rechecking, apply through the Examination module within 7 days of result declaration.',
  contact: 'You can contact us at: Main Office: +91 11 1234 5678, Admissions: +91 11 1234 5679, Email: info@excellenceuniv.edu.in. Visit our Contact page for department-specific contacts and location map.',
  help: 'I can help you with information about Admissions, Courses, Fees, Examinations, Attendance, Timetables, Library, Results, Campus facilities, News & Events, and general University queries. Just ask me anything!',
  
  // New public website responses
  website: 'Our university website has several sections: Home for latest updates, About for our vision & mission, Academics for programs, Admissions for application process, Research for our innovations, Campus Life for facilities, News & Events for updates, Gallery for photos & videos, and Contact for reaching us.',
  about: 'Excellence University was founded in 1965 with a vision to provide world-class education. We have 25,000+ students, 1,200+ faculty members, and maintain a 95% placement rate. Our core values are Excellence, Innovation, Integrity, and Inclusivity. Learn more on our About page.',
  research: 'We have 500+ active researchers working on 120+ projects in AI & Machine Learning, Renewable Energy, Biotechnology, and Quantum Computing. We\'ve published 3,500+ research papers and filed 150+ patents. Visit our Research & Innovation page for details.',
  campus: 'Our modern campus features a Central Library with 500,000+ books, separate hostels for boys and girls, Olympic-size swimming pool, sports complex, multiple cafeterias, 24/7 WiFi, and high-security. Explore the Campus Life page for virtual tour.',
  hostel: 'We provide fully furnished single/double occupancy rooms with attached bathrooms, 24/7 water & electricity, mess facility (Veg & Non-veg), laundry, medical room, study rooms, and biometric security. Visit Campus Life page for more hostel details.',
  sports: 'Our sports complex offers Cricket, Football, Basketball, Volleyball, Table Tennis, Badminton, Swimming, Athletics, Chess, and Yoga & Fitness Center. We have an Olympic-size pool and indoor stadium. Check Campus Life for facilities.',
  event: 'Upcoming events include Annual Convocation (March 20), Tech Fest 2026 (March 5-7), Guest Lectures, and Sports Meet (Feb 20-25). Visit our News & Events page for the complete calendar and event details.',
  gallery: 'View our vibrant campus life in the Gallery section featuring photos of campus buildings, events, laboratories, sports activities, and videos including campus tours, convocation highlights, and student life.',
  scholarship: 'We offer multiple scholarships: Merit Scholarship (up to 100% fee waiver for top 10%), Sports Scholarship (50% for state/national level players), Need-Based Scholarship (75% for family income < ₹6 lakhs), and Research Fellowships (₹31,000/month for Ph.D students).',
  placement: 'We maintain a 98% placement rate with top companies like Google, Microsoft, Amazon, TCS, Infosys, Wipro, and Deloitte visiting campus. Average package is ₹8 LPA with highest reaching ₹45 LPA. Our Career Development Center provides training and placement support.',
  faculty: 'We have 1,200+ highly qualified faculty members including professors, associate professors, and assistant professors with Ph.D degrees from top universities. Many are published researchers and industry experts. Visit Academics page for department-wise faculty information.',
  eligibility: 'Eligibility varies by program: UG requires 60% in 10+2 with entrance test, PG needs 55% in Bachelor\'s with GATE/CAT/MAT, Ph.D requires 60% in Master\'s with NET/GATE and research proposal. Age limit for UG is 17-25 years. Visit Admissions page for detailed criteria.',
  location: 'We are located at Excellence University Campus, Knowledge Park, University Road, New Delhi - 110001, India. Our campus is well-connected by metro and bus services. Visit Contact page for map and directions.',
  apply: 'To apply: 1) Register online on our website, 2) Upload required documents, 3) Pay application fee, 4) Appear for entrance test, 5) Attend counseling if selected. Applications for 2026-27 are open from January 15 to April 30. Start your application on the Admissions page.',
};

const quickSuggestions = [
  'How to apply for admission?',
  'Scholarship information',
  'Campus facilities',
  'Exam schedule',
  'Course list',
  'Contact details',
];

export function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today? You can ask me about admissions, courses, fees, exams, attendance, and more!';
    }

    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Feel free to ask if you have any other questions. Have a great day! 😊';
    }

    return 'I\'m here to help! You can ask me about:\n• Admissions and courses\n• Fee payments and scholarships\n• Examination schedules and results\n• Attendance and timetables\n• Library services\n• General university information\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0.7)',
              '0 0 0 20px rgba(59, 130, 246, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="rounded-full"
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="lg"
            className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}