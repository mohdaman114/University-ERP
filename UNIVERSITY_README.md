# UniverCity - University Management System (ERP)

A comprehensive, modern, and intelligent University Management System built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🎓 Features

### Role-Based Access Control
The system supports 8 different user roles with specific dashboards and permissions:

1. **Super Admin / Admin**
   - Complete system overview with analytics
   - User management
   - Department and course management
   - Notice board management
   - Real-time charts and statistics

2. **Student**
   - Attendance tracking with percentage
   - Examination schedules and results
   - Fee payment status and history
   - Weekly timetable
   - Study materials access
   - Library book management
   - Personal notices and announcements

3. **Faculty**
   - Subject management
   - Attendance marking
   - Marks entry system
   - Study material upload (PDF, videos, links)
   - Daily schedule overview
   - Student performance insights

4. **Examination Cell**
   - Exam scheduling
   - Hall ticket generation
   - Result processing and publishing
   - Revaluation management

5. **Accounts Department**
   - Fee structure management
   - Payment tracking (online/offline)
   - Receipt and invoice generation
   - Financial reports and analytics

6. **Library Staff**
   - Book inventory management
   - Issue/return system
   - Fine calculation
   - Book search and availability

7. **Support Staff**
   - Ticket management system

### 🤖 AI-Powered Chatbox
- Intelligent assistant available on all pages
- Natural language query processing
- Contextual responses for:
  - Admissions and courses
  - Fee payments and scholarships
  - Examination schedules
  - Attendance queries
  - Library services
  - General university information
- Quick suggestion buttons
- Real-time typing indicators
- Message history

### 🎨 Modern UI/UX
- **Fully responsive** - Works seamlessly on desktop, tablet, and mobile
- **Dark mode support** - Automatic theme switching
- **Smooth animations** - Motion/Framer Motion for fluid transitions
- **Modern gradient designs** - Beautiful color schemes
- **Interactive charts** - Recharts for data visualization
- **Toast notifications** - Sonner for user feedback
- **Custom scrollbars** - Enhanced visual experience
- **Micro-animations** - Hover effects and loading states

### 📊 Analytics & Reporting
- Real-time statistics dashboard
- Interactive bar and pie charts
- Department-wise distribution
- Revenue tracking
- Attendance analytics
- User distribution visualization

## 🚀 Demo Credentials

You can test the system with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@university.edu | admin123 |
| Student | student@university.edu | student123 |
| Faculty | faculty@university.edu | faculty123 |
| Examination | exam@university.edu | exam123 |
| Accounts | accounts@university.edu | accounts123 |
| Library | library@university.edu | library123 |

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **State Management**: React Context API
- **Build Tool**: Vite

## 📱 Features by Module

### Student Dashboard
- ✅ Real-time attendance percentage with visual progress bars
- ✅ Subject-wise attendance breakdown
- ✅ Examination schedule with upcoming exams
- ✅ Results and grade reports
- ✅ Fee payment status and history
- ✅ Weekly timetable with room details
- ✅ Study materials download
- ✅ Library book issues tracking
- ✅ Targeted notices and announcements

### Faculty Dashboard
- ✅ Subject allocation overview
- ✅ Today's class schedule
- ✅ Quick attendance marking
- ✅ Study material upload (multiple formats)
- ✅ Student performance tracking
- ✅ Material management table

### Admin Dashboard
- ✅ University-wide analytics
- ✅ Interactive department statistics
- ✅ User role distribution charts
- ✅ Revenue and collection tracking
- ✅ Recent notices overview
- ✅ Department management
- ✅ Real-time metrics

### Examination Dashboard
- ✅ Complete exam schedule table
- ✅ Exam type categorization
- ✅ Status tracking (upcoming/completed)
- ✅ Subject-wise examination details

### Accounts Dashboard
- ✅ Total revenue visualization
- ✅ Pending fees tracking
- ✅ Payment history table
- ✅ Receipt number tracking
- ✅ Payment mode analytics

### Library Dashboard
- ✅ Complete book inventory
- ✅ Available vs issued tracking
- ✅ Overdue book alerts
- ✅ Book search functionality
- ✅ Category-wise organization

## 🎯 Key Highlights

1. **Secure Authentication**: Role-based access with session management
2. **Responsive Design**: Mobile-first approach, works on all devices
3. **Real-time Updates**: Instant data synchronization
4. **Modern Animations**: Smooth transitions and micro-interactions
5. **Accessibility**: WCAG compliant components
6. **Performance**: Optimized bundle size and lazy loading
7. **Scalable Architecture**: Clean component structure
8. **Type Safety**: Full TypeScript support

## 🎨 Design Philosophy

- **Clean & Minimalist**: Focus on content and functionality
- **Gradient Accents**: Modern gradient colors for visual appeal
- **Card-Based Layout**: Organized information in digestible chunks
- **Consistent Spacing**: Proper use of whitespace
- **Professional Color Scheme**: Blue-Purple gradient theme
- **Intuitive Navigation**: Easy-to-use sidebar and top bar
- **Visual Feedback**: Loading states, hover effects, and animations

## 📝 Data Management

All data is managed through React Context providers with local state management:
- **AuthContext**: User authentication and session
- **UniversityContext**: All university data (departments, courses, subjects, etc.)
- **Mock Data**: Comprehensive mock data for all modules
- **LocalStorage**: Session persistence for authentication

## 🔒 Note on Production Use

This is a **frontend prototype/demo** built for development and demonstration purposes. For production deployment:
- Implement a robust backend with proper database
- Add server-side authentication and authorization
- Implement data encryption and security measures
- Add input validation and sanitization
- Implement proper error handling and logging
- Add data backup and recovery systems
- Follow data protection regulations (GDPR, etc.)
- Implement rate limiting and DDoS protection

## 📄 License

This project is for educational and demonstration purposes.

---

Built with ❤️ using modern web technologies
