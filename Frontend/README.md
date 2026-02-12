# University Management System

This project is a comprehensive University Management System built with modern web technologies, providing various dashboards for different user roles (Admin, Faculty, Student) and a public-facing website for general information. It features a robust UI, state management, and routing capabilities to deliver a seamless user experience.

## Features

*   **Role-Based Dashboards**: Separate dashboards for Admin, Faculty, and Students with tailored functionalities.
*   **Public Website**: Informational pages for About, Academics, Admissions, Campus, Contact, Gallery, News, and Research.
*   **Product Catalog & Shopping Cart**: Functionality to browse products, add them to a cart, and proceed to checkout.
*   **Authentication**: Secure login page for university users.
*   **Responsive Design**: Optimized for various screen sizes using Tailwind CSS.
*   **Interactive UI Components**: Utilizes Radix UI primitives for accessible and customizable UI elements.
*   **AI Chatbox**: Integrated AI chat functionality.

## Role-Based Dashboards Details

### Admin Dashboard

The Admin Dashboard provides comprehensive control over the university's operations, allowing administrators to manage users, courses, departments, and system settings.

*   **User Management**:
    *   Add, edit, and delete student, faculty, and staff accounts.
    *   Assign roles and permissions to users.
    *   Reset user passwords.
*   **Course Management**:
    *   Create, update, and delete academic courses.
    *   Assign faculty members to courses.
    *   Manage course schedules and capacities.
*   **Department Management**:
    *   Create, update, and delete university departments.
    *   Assign heads of departments.
*   **Academic Calendar Management**:
    *   Manage academic terms, holidays, and important dates.
*   **System Configuration**:
    *   Configure system-wide settings and parameters.
*   **Reporting and Analytics**:
    *   Generate reports on student enrollment, faculty workload, and other key metrics.
    *   View system usage and performance analytics.

### Faculty Dashboard

The Faculty Dashboard empowers educators to manage their courses, interact with students, and handle academic responsibilities efficiently.

*   **Course Management**:
    *   View a list of assigned courses.
    *   Upload and manage course materials (syllabi, lecture notes, readings).
    *   Publish announcements specific to their courses.
*   **Student Management**:
    *   View enrolled students for each course.
    *   Record and manage student grades.
    *   Track student attendance.
*   **Assignment Management**:
    *   Create and publish assignments, quizzes, and exams.
    *   Grade submitted assignments and provide feedback.
*   **Communication**:
    *   Send messages to individual students or entire classes.
    *   Participate in faculty-wide communications.
*   **Personal Profile Management**:
    *   Update personal information, contact details, and academic qualifications.

### Student Dashboard

The Student Dashboard offers students a personalized portal to manage their academic journey, access course information, and communicate with faculty.

*   **Course Enrollment**:
    *   Browse available courses and view course details.
    *   Enroll in and drop courses.
    *   View current and past course registrations.
*   **Grades and Academic Records**:
    *   Access current grades and academic transcripts.
    *   View progress towards degree completion.
*   **Timetable/Schedule**:
    *   View personalized class schedules and examination timetables.
*   **Assignment Submission and Tracking**:
    *   Submit assignments online.
    *   Track the status of submitted assignments and view grades.
*   **Communication**:
    *   Send messages to faculty members.
    *   Receive important announcements from the university and course instructors.
*   **Personal Profile Management**:
    *   Update personal contact information.

## Tech Stack

The project leverages a modern web development stack to ensure performance, scalability, and maintainability.

### Core Technologies
*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static typing.
*   **Vite**: A fast build tool that provides a lightning-fast development experience.

### UI & Styling
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **Radix UI**: A collection of unstyled, accessible UI components for React.
    *   `@radix-ui/react-accordion`
    *   `@radix-ui/react-alert-dialog`
    *   `@radix-ui/react-aspect-ratio`
    *   `@radix-ui/react-avatar`
    *   `@radix-ui/react-checkbox`
    *   `@radix-ui/react-collapsible`
    *   `@radix-ui/react-context-menu`
    *   `@radix-ui/react-dialog`
    *   `@radix-ui/react-dropdown-menu`
    *   `@radix-ui/react-hover-card`
    *   `@radix-ui/react-label`
    *   `@radix-ui/react-menubar`
    *   `@radix-ui/react-navigation-menu`
    *   `@radix-ui/react-popover`
    *   `@radix-ui/react-progress`
    *   `@radix-ui/react-radio-group`
    *   `@radix-ui/react-scroll-area`
    *   `@radix-ui/react-select`
    *   `@radix-ui/react-separator`
    *   `@radix-ui/react-slider`
    *   `@radix-ui/react-slot`
    *   `@radix-ui/react-switch`
    *   `@radix-ui/react-tabs`
    *   `@radix-ui/react-toggle`
    *   `@radix-ui/react-toggle-group`
    *   `@radix-ui/react-tooltip`
*   **Class Variance Authority (cva)**: A utility for creating flexible and reusable component variants.
*   **clsx & tailwind-merge**: Utilities for conditionally joining class names and merging Tailwind CSS classes without conflicts.
*   **Lucide React**: A collection of beautiful and customizable open-source icons.
*   **Motion**: A production-ready motion library for React.
*   **tw-animate-css**: Tailwind CSS animations.

### State Management & Data Handling
*   **React Hook Form**: For flexible and extensible forms with easy-to-use validation.
*   **date-fns**: A modern JavaScript date utility library.
*   **react-day-picker**: A flexible date picker component for React.
*   **recharts**: A composable charting library built with React and D3.

### Routing
*   **React Router DOM**: Declarative routing for React.

### Other Libraries
*   **@emotion/react & @emotion/styled**: For styling React components.
*   **@mui/icons-material & @mui/material**: Material-UI components and icons.
*   **@popperjs/core**: A positioning engine for tooltips, popovers, and dropdowns.
*   **cmdk**: A command menu component for React.
*   **embla-carousel-react**: A carousel library for React.
*   **input-otp**: One-time password input component.
*   **next-themes**: Theme management for Next.js applications (though used in a Vite project here).
*   **react-dnd & react-dnd-html5-backend**: Drag and Drop for React.
*   **react-popper**: Popper.js integration for React.
*   **react-resizable-panels**: Resizable panel components.
*   **react-responsive-masonry**: Responsive masonry layout component.
*   **react-slick**: Carousel component for React.
*   **sonner**: A toast library for React.
*   **vaul**: A dialog component for React.

## Project Structure

The project follows a modular structure, organizing code by feature and type.

```
.
├── dist/                          # Production build output
├── guidelines/                    # Project guidelines and documentation
│   └── Guidelines.md
├── src/                           # Source code
│   ├── app/
│   │   ├── components/            # Reusable React components
│   │   │   ├── figma/             # Figma-related components (e.g., ImageWithFallback)
│   │   │   ├── university/        # Components specific to university dashboards
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── FacultyDashboard.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── OtherDashboards.tsx
│   │   │   │   └── StudentDashboard.tsx
│   │   │   ├── website/           # Components specific to the public website
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   ├── AcademicsPage.tsx
│   │   │   │   ├── AdmissionsPage.tsx
│   │   │   │   ├── CampusPage.tsx
│   │   │   │   ├── ContactPage.tsx
│   │   │   │   ├── GalleryPage.tsx
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── NewsPage.tsx
│   │   │   │   ├── PublicFooter.tsx
│   │   │   │   ├── PublicNavbar.tsx
│   │   │   │   └── ResearchPage.tsx
│   │   │   ├── AIChatbox.tsx      # AI Chatbox component
│   │   │   ├── CheckoutDialog.tsx # Checkout dialog component
│   │   │   ├── Footer.tsx         # Global footer component
│   │   │   ├── Header.tsx         # Global header component
│   │   │   ├── LoadingScreen.tsx  # Loading screen component
│   │   │   ├── ProductCard.tsx    # Product card component
│   │   │   ├── ProductDetailDialog.tsx # Product detail dialog
│   │   │   └── ShoppingCartSheet.tsx # Shopping cart sheet
│   │   └── App.tsx                # Main application component
│   ├── contexts/                  # React Context API for global state
│   │   ├── AuthContext.tsx        # Authentication context
│   │   └── UniversityContext.tsx  # University-specific context
│   ├── data/                      # Mock data or static data
│   │   └── mockData.ts
│   ├── styles/                    # Global styles and CSS configurations
│   │   ├── fonts.css
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   ├── types/                     # TypeScript type definitions
│   │   └── university.ts
│   └── main.tsx                   # Entry point of the React application
├── ATTRIBUTIONS.md                # Attribution for third-party assets/code
├── README.md                      # Project README (this file)
├── UNIVERSITY_README.md           # Specific README for university section
├── WEBSITE_GUIDE.md               # Guide for the public website section
├── index.html                     # Main HTML file
├── package-lock.json              # Dependency lock file
├── package.json                   # Project metadata and dependencies
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite build configuration
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm or pnpm (recommended)
*   Node.js (v18 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd University
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    # or npm install
    ```

### Running the Development Server

To start the development server:

```bash
pnpm dev
# or npm run dev
```

This will typically start the application on `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
pnpm build
# or npm run build
```

The production-ready files will be generated in the `dist/` directory.

## Usage

Once the development server is running, you can access the application in your web browser.

*   **Public Website**: Navigate to the root URL (e.g., `http://localhost:5173`) to view the public website.
*   **Login Page**: Access the login page to authenticate as an Admin, Faculty, or Student.
*   **Dashboards**: After successful login, you will be redirected to the respective dashboard based on your role.

## Contributing

Contributions are welcome! Please refer to `guidelines/Guidelines.md` for more information on how to contribute.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - your_email@example.com

Project Link: [https://github.com/your_username/your_project](https://github.com/your_username/your_project)
