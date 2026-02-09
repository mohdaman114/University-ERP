# Excellence University - Complete Website & ERP System

## Overview
A comprehensive, modern University Website that serves as both a public-facing informational portal and an entry point to a secure ERP-based University Management System.

## Features

### 🌐 Public University Website
- **Home Page**: Hero carousel, stats, features, announcements, quick links
- **About**: Vision, mission, values, history timeline, leadership team
- **Academics**: Faculties, departments, UG/PG/PhD programs, syllabus
- **Admissions**: Process, eligibility, dates, scholarships, online application
- **Research**: Focus areas, publications, facilities, patents
- **Campus Life**: Library, hostels, sports, facilities, amenities
- **News & Events**: Latest news, upcoming events, notices
- **Gallery**: Campus photos, events, labs, sports, videos
- **Contact**: Contact info, departments, map, inquiry form

### 🔐 ERP System (Secure Portal)
Access via: `/erp` route

**Role-Based Dashboards:**
- **Super Admin/Admin**: User management, analytics, system control
- **Student**: Attendance, assignments, grades, timetable, fees
- **Faculty**: Subject management, attendance, grades, announcements
- **Examination**: Exam scheduling, results, hall tickets
- **Accounts**: Fee tracking, payments, reports
- **Library**: Book management, issue/return, inventory

### 🤖 AI-Powered Chatbox
Available on all pages with intelligent responses for:
- Admissions and course information
- Fee structures and scholarships
- Campus facilities and hostels
- Examination schedules and results
- Library services and timings
- Contact and location details
- Navigation assistance

## Technical Stack
- **Frontend**: React 18.3.1 + TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Images**: Unsplash API

## Project Structure
```
/src
├── /app
│   ├── App.tsx                    # Main app with routing
│   └── /components
│       ├── /website               # Public website pages
│       │   ├── PublicNavbar.tsx
│       │   ├── PublicFooter.tsx
│       │   ├── HomePage.tsx
│       │   ├── AboutPage.tsx
│       │   ├── AcademicsPage.tsx
│       │   ├── AdmissionsPage.tsx
│       │   ├── ResearchPage.tsx
│       │   ├── CampusPage.tsx
│       │   ├── NewsPage.tsx
│       │   ├── GalleryPage.tsx
│       │   └── ContactPage.tsx
│       ├── /university            # ERP system
│       │   ├── LoginPage.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── AdminDashboard.tsx
│       │   ├── StudentDashboard.tsx
│       │   ├── FacultyDashboard.tsx
│       │   └── OtherDashboards.tsx
│       ├── AIChatbox.tsx          # AI assistant
│       └── /ui                    # Reusable UI components
├── /contexts
│   ├── AuthContext.tsx
│   └── UniversityContext.tsx
├── /data
│   └── mockData.ts
└── /styles
    ├── index.css
    ├── theme.css
    └── fonts.css
```

## Routes

### Public Website
- `/` - Home page
- `/about` - About university
- `/academics` - Academic programs
- `/admissions` - Admission information
- `/research` - Research & innovation
- `/campus` - Campus life
- `/news` - News & events
- `/gallery` - Photo & video gallery
- `/contact` - Contact information

### ERP System
- `/erp` - Login page / Dashboard (based on authentication)

## User Credentials (Demo)

**Admin:**
- Email: admin@university.edu
- Password: admin123

**Student:**
- Email: student@university.edu
- Password: student123

**Faculty:**
- Email: faculty@university.edu
- Password: faculty123

## Key Features

### Modern UI/UX
✅ Fully responsive design (mobile, tablet, desktop)
✅ Smooth animations and transitions
✅ Modern gradient effects
✅ Professional color palette
✅ Clean typography
✅ Intuitive navigation

### Performance
✅ Optimized images
✅ Lazy loading
✅ Smooth scrolling
✅ Fast page transitions
✅ Efficient state management

### Accessibility
✅ Semantic HTML
✅ ARIA labels
✅ Keyboard navigation
✅ Color contrast compliance
✅ Screen reader friendly

## Deployment
The application is a static frontend that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Future Enhancements
- Online payment integration
- Real-time notifications
- Video conferencing
- Mobile app
- Multi-language support
- Advanced analytics
- Document management
- Alumni portal

## Support
For queries, contact:
- Email: info@excellenceuniv.edu.in
- Phone: +91 11 1234 5678
- Website: [Excellence University](#)

---
Built with ❤️ using React, TypeScript, and Tailwind CSS
