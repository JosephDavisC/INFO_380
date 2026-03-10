# GSU Modern University Course Registration System

**INFO 380 Final Project Prototype** — Team BB-16

A modern, responsive course registration system prototype built to improve the university enrollment experience.

**Live Demo:** [info380.joechamdani.com](https://info380.joechamdani.com)

## Team

- Joseph Chamdani
- Kenneth Wu
- Nicole Luu
- Evelyn Fu

## Features

- **Course Search** — Filter by subject, instructor, schedule, format, and more. Sort by code, title, credits, open seats, or waitlist size. Mobile-friendly card layout.
- **Registration Cart** — Add/remove courses with a visual weekly calendar. Conflict detection, credit limit validation, and backup section selection.
- **Waitlist Management** — Track waitlist positions, estimated wait times, and enrollment probability. Toggle auto-enroll per course.
- **Advisor Dashboard** — Student lookup, current schedule view, degree progress tracking, and override request approvals.
- **Admin Dashboard** — Course capacity management, enrollment analytics by department, report builder, audit log, and system performance metrics.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations
- **Lucide React** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                  # Main app shell, navigation, context providers
├── index.css                # Tailwind theme and global styles
├── main.tsx                 # Entry point
├── data/
│   ├── mockData.ts          # Sample courses, students, waitlists
│   └── types.ts             # TypeScript interfaces
└── views/
    ├── CourseSearch.tsx      # Search, filter, sort courses
    ├── RegistrationCart.tsx  # Cart + weekly calendar
    ├── WaitlistManagement.tsx
    ├── AdvisorDashboard.tsx
    └── AdminDashboard.tsx
```
