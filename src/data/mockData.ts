import type { Course, WaitlistEntry, Student, OverrideRequest, AuditLogEntry, EnrollmentData, SystemAlert, AtRiskIndicator } from './types';

const COLORS = ['#4b2e83', '#7b5cb0', '#b7a57a', '#22c55e', '#06b6d4', '#ec4899', '#f97316', '#6366f1'];

export const courses: Course[] = [
  {
    id: '1', code: 'CS 301', title: 'Data Structures & Algorithms', instructor: 'Dr. Sarah Chen',
    days: ['M', 'W', 'F'], startTime: '09:00', endTime: '09:50', location: 'SCI 201', format: 'In-Person',
    enrolled: 28, capacity: 30, waitlistCount: 5, credits: 3, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CS 201', title: 'Introduction to Programming', status: 'met' }, { code: 'MATH 124', title: 'Calculus I', status: 'met' }],
    description: 'Fundamental data structures including arrays, linked lists, trees, graphs, and hash tables. Analysis of algorithms for searching, sorting, and graph traversal.',
    color: COLORS[0],
    sections: [
      { section: '001', days: ['M', 'W', 'F'], startTime: '09:00', endTime: '09:50', enrolled: 28, capacity: 30, format: 'In-Person' },
      { section: '002', days: ['T', 'Th'], startTime: '10:00', endTime: '11:15', enrolled: 20, capacity: 30, format: 'In-Person' },
      { section: '003', days: ['M', 'W', 'F'], startTime: '14:00', endTime: '14:50', enrolled: 15, capacity: 30, format: 'In-Person' },
    ],
  },
  {
    id: '2', code: 'CS 415', title: 'Machine Learning', instructor: 'Dr. James Park',
    days: ['T', 'Th'], startTime: '11:00', endTime: '12:15', location: 'ENG 105', format: 'In-Person',
    enrolled: 25, capacity: 25, waitlistCount: 12, credits: 3, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CS 301', title: 'Data Structures & Algorithms', status: 'met' }, { code: 'STAT 350', title: 'Probability & Statistics', status: 'met' }, { code: 'MATH 240', title: 'Linear Algebra', status: 'met' }],
    description: 'Introduction to machine learning concepts including supervised and unsupervised learning, neural networks, decision trees, and model evaluation.',
    color: COLORS[1], crossListed: ['DATA 415', 'INFO 415'], corequisites: ['CS 415L'],
    sections: [
      { section: '001', days: ['T', 'Th'], startTime: '11:00', endTime: '12:15', enrolled: 25, capacity: 25, format: 'In-Person' },
    ],
  },
  {
    id: '3', code: 'MATH 240', title: 'Linear Algebra', instructor: 'Dr. Emily Rodriguez',
    days: ['M', 'W', 'F'], startTime: '10:00', endTime: '10:50', location: 'MATH 310', format: 'In-Person',
    enrolled: 22, capacity: 35, waitlistCount: 0, credits: 3, subject: 'Mathematics', prereqStatus: 'met',
    prerequisites: [{ code: 'MATH 126', title: 'Calculus III', status: 'met' }],
    description: 'Systems of linear equations, vector spaces, linear transformations, eigenvalues and eigenvectors, inner product spaces.',
    color: COLORS[2],
    sections: [
      { section: '001', days: ['M', 'W', 'F'], startTime: '10:00', endTime: '10:50', enrolled: 22, capacity: 35, format: 'In-Person' },
      { section: '002', days: ['T', 'Th'], startTime: '14:00', endTime: '15:15', enrolled: 18, capacity: 35, format: 'In-Person' },
    ],
  },
  {
    id: '4', code: 'STAT 350', title: 'Probability & Statistics', instructor: 'Dr. Michael Torres',
    days: ['T', 'Th'], startTime: '14:00', endTime: '15:15', location: 'STAT 200', format: 'Hybrid',
    enrolled: 18, capacity: 40, waitlistCount: 0, credits: 3, subject: 'Statistics', prereqStatus: 'in-progress',
    prerequisites: [{ code: 'MATH 126', title: 'Calculus III', status: 'met' }, { code: 'MATH 240', title: 'Linear Algebra', status: 'in-progress' }],
    description: 'Probability theory, random variables, distributions, statistical inference, hypothesis testing, and regression analysis.',
    color: COLORS[3],
    corequisites: ['STAT 350L'],
    sections: [
      { section: '001', days: ['T', 'Th'], startTime: '14:00', endTime: '15:15', enrolled: 18, capacity: 40, format: 'Hybrid' },
      { section: '002', days: ['T', 'Th'], startTime: '14:00', endTime: '15:15', enrolled: 12, capacity: 40, format: 'Hybrid' },
      { section: '003', days: ['M', 'W', 'F'], startTime: '13:00', endTime: '13:50', enrolled: 8, capacity: 35, format: 'In-Person' },
      { section: '004', days: [], startTime: '', endTime: '', enrolled: 15, capacity: 50, format: 'Online' },
    ],
  },
  {
    id: '5', code: 'CS 380', title: 'Database Systems', instructor: 'Dr. Lisa Wang',
    days: ['M', 'W'], startTime: '13:00', endTime: '14:15', location: 'SCI 305', format: 'In-Person',
    enrolled: 30, capacity: 30, waitlistCount: 8, credits: 3, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CS 301', title: 'Data Structures & Algorithms', status: 'met' }],
    description: 'Database design, relational model, SQL, normalization, query optimization, transaction management, and NoSQL databases.',
    color: COLORS[4],
  },
  {
    id: '6', code: 'CS 490', title: 'Senior Capstone', instructor: 'Dr. Robert Kim',
    days: ['W', 'F'], startTime: '15:00', endTime: '16:15', location: 'Online', format: 'Online',
    enrolled: 12, capacity: 20, waitlistCount: 0, credits: 4, subject: 'Computer Science', prereqStatus: 'not-met',
    prerequisites: [{ code: 'CS 350', title: 'Operating Systems', status: 'in-progress' }, { code: 'CS 380', title: 'Database Systems', status: 'met' }, { code: 'CS 301', title: 'Data Structures & Algorithms', status: 'met' }],
    description: 'Culminating project integrating skills from the CS curriculum. Students work in teams to design, implement, and present a significant software project.',
    color: COLORS[5],
  },
  {
    id: '7', code: 'PHIL 210', title: 'Ethics in Technology', instructor: 'Dr. Anna Foster',
    days: ['T', 'Th'], startTime: '09:30', endTime: '10:45', location: 'HUM 102', format: 'In-Person',
    enrolled: 15, capacity: 30, waitlistCount: 0, credits: 3, subject: 'Philosophy', prereqStatus: 'met',
    prerequisites: [], description: 'Ethical issues arising from information technology, AI, privacy, intellectual property, and the digital divide.',
    color: COLORS[6],
  },
  {
    id: '8', code: 'ENG 301', title: 'Technical Writing', instructor: 'Prof. David Lee',
    days: ['M', 'W', 'F'], startTime: '11:00', endTime: '11:50', location: 'LIB 205', format: 'In-Person',
    enrolled: 20, capacity: 25, waitlistCount: 2, credits: 3, subject: 'English', prereqStatus: 'met',
    prerequisites: [{ code: 'ENG 101', title: 'English Composition', status: 'met' }],
    description: 'Principles and practices of technical communication including reports, proposals, documentation, and presentations for technical audiences.',
    color: COLORS[7],
  },
  {
    id: '9', code: 'CS 350', title: 'Operating Systems', instructor: 'Dr. Sarah Chen',
    days: ['T', 'Th'], startTime: '13:00', endTime: '14:15', location: 'SCI 201', format: 'In-Person',
    enrolled: 24, capacity: 30, waitlistCount: 3, credits: 3, subject: 'Computer Science', prereqStatus: 'in-progress',
    prerequisites: [{ code: 'CS 301', title: 'Data Structures & Algorithms', status: 'met' }, { code: 'CS 261', title: 'Computer Architecture', status: 'in-progress' }],
    description: 'Process management, memory management, file systems, I/O, concurrency, and distributed systems fundamentals.',
    color: COLORS[0],
    corequisites: ['CS 261'],
  },
  {
    id: '10', code: 'MATH 310', title: 'Differential Equations', instructor: 'Dr. Emily Rodriguez',
    days: ['M', 'W', 'F'], startTime: '14:00', endTime: '14:50', location: 'MATH 215', format: 'In-Person',
    enrolled: 19, capacity: 35, waitlistCount: 0, credits: 3, subject: 'Mathematics', prereqStatus: 'not-met',
    prerequisites: [{ code: 'MATH 240', title: 'Linear Algebra', status: 'not-met' }, { code: 'MATH 126', title: 'Calculus III', status: 'met' }],
    description: 'Ordinary differential equations, Laplace transforms, systems of ODEs, numerical methods, and applications in science and engineering.',
    color: COLORS[2],
  },
  {
    id: '11', code: 'CS 261', title: 'Computer Architecture', instructor: 'Dr. Kevin Nakamura',
    days: ['M', 'W', 'F'], startTime: '08:00', endTime: '08:50', location: 'ENG 302', format: 'In-Person',
    enrolled: 27, capacity: 30, waitlistCount: 4, credits: 3, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CS 201', title: 'Introduction to Programming', status: 'met' }],
    description: 'Digital logic, instruction set architecture, pipelining, memory hierarchy, I/O systems, and introduction to parallel processing.',
    color: COLORS[1],
  },
  {
    id: '12', code: 'INFO 340', title: 'Client-Side Development', instructor: 'Prof. Jessica Hwang',
    days: ['T', 'Th'], startTime: '15:30', endTime: '16:45', location: 'INF 110', format: 'In-Person',
    enrolled: 35, capacity: 35, waitlistCount: 10, credits: 3, subject: 'Informatics', prereqStatus: 'met',
    prerequisites: [{ code: 'INFO 201', title: 'Technical Foundations', status: 'met' }],
    description: 'Modern client-side web development using HTML, CSS, JavaScript, and React. Responsive design, accessibility, and web application architecture.',
    color: COLORS[4],
  },
  {
    id: '13', code: 'STAT 390', title: 'Statistical Computing', instructor: 'Dr. Michael Torres',
    days: ['M', 'W'], startTime: '15:30', endTime: '16:45', location: 'STAT 105', format: 'Hybrid',
    enrolled: 14, capacity: 30, waitlistCount: 0, credits: 3, subject: 'Statistics', prereqStatus: 'met',
    prerequisites: [{ code: 'STAT 350', title: 'Probability & Statistics', status: 'met' }],
    description: 'Computational methods for statistical analysis using R and Python. Simulation, bootstrapping, Monte Carlo methods.',
    color: COLORS[3],
  },
  {
    id: '14', code: 'PHIL 305', title: 'Philosophy of Mind', instructor: 'Dr. Anna Foster',
    days: ['M', 'W', 'F'], startTime: '12:00', endTime: '12:50', location: 'HUM 205', format: 'In-Person',
    enrolled: 10, capacity: 25, waitlistCount: 0, credits: 3, subject: 'Philosophy', prereqStatus: 'met',
    prerequisites: [], description: 'Examination of consciousness, intentionality, artificial intelligence, and the mind-body problem.',
    color: COLORS[6],
  },
  {
    id: '15', code: 'ENG 282', title: 'Introduction to Film Studies', instructor: 'Prof. Rachel Kim',
    days: ['T', 'Th'], startTime: '17:00', endTime: '19:00', location: 'KAN 120', format: 'In-Person',
    enrolled: 48, capacity: 50, waitlistCount: 6, credits: 5, subject: 'English', prereqStatus: 'met',
    prerequisites: [], description: 'Survey of cinema from silent era to present, examining narrative, documentary, and experimental filmmaking through critical analysis.',
    color: COLORS[7],
  },
  {
    id: '16', code: 'CS 446', title: 'Computer Networks', instructor: 'Dr. Robert Kim',
    days: ['M', 'W'], startTime: '09:00', endTime: '10:15', location: 'ENG 203', format: 'In-Person',
    enrolled: 22, capacity: 28, waitlistCount: 1, credits: 3, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CS 350', title: 'Operating Systems', status: 'met' }],
    description: 'TCP/IP protocol stack, routing, switching, network security, wireless networking, and application-layer protocols.',
    color: COLORS[5],
  },
  {
    id: '17', code: 'MATH 401', title: 'Abstract Algebra', instructor: 'Dr. Wei Zhang',
    days: ['T', 'Th'], startTime: '08:00', endTime: '09:15', location: 'MATH 102', format: 'In-Person',
    enrolled: 8, capacity: 25, waitlistCount: 0, credits: 3, subject: 'Mathematics', prereqStatus: 'not-met',
    prerequisites: [{ code: 'MATH 240', title: 'Linear Algebra', status: 'not-met' }],
    description: 'Groups, rings, fields, homomorphisms, quotient structures, and applications to number theory and geometry.',
    color: COLORS[2],
  },
  {
    id: '18', code: 'CSE 373', title: 'Data Structures & Algorithms', instructor: 'Dr. Kevin Lin',
    days: ['M', 'W', 'F'], startTime: '10:30', endTime: '11:20', location: 'CSE2 G01', format: 'In-Person',
    enrolled: 195, capacity: 200, waitlistCount: 15, credits: 4, subject: 'Computer Science', prereqStatus: 'met',
    prerequisites: [{ code: 'CSE 143', title: 'Computer Programming II', status: 'met' }],
    description: 'Fundamental data structures and algorithms including stacks, queues, trees, graphs, sorting, searching, and analysis of algorithm complexity.',
    color: COLORS[0],
    sections: [
      { section: 'A', days: ['M', 'W', 'F'], startTime: '10:30', endTime: '11:20', enrolled: 195, capacity: 200, format: 'In-Person' },
      { section: 'B', days: ['M', 'W', 'F'], startTime: '12:30', endTime: '13:20', enrolled: 180, capacity: 200, format: 'In-Person' },
    ],
  },
  {
    id: '19', code: 'INFO 330', title: 'Databases & Data Modeling', instructor: 'Prof. David Hendry',
    days: ['T', 'Th'], startTime: '10:00', endTime: '11:20', location: 'MGH 241', format: 'In-Person',
    enrolled: 28, capacity: 35, waitlistCount: 3, credits: 4, subject: 'Informatics', prereqStatus: 'met',
    prerequisites: [{ code: 'INFO 201', title: 'Technical Foundations', status: 'met' }],
    description: 'Relational database design and modeling. SQL programming, entity-relationship modeling, normalization, and data management principles.',
    color: COLORS[4],
    sections: [
      { section: 'A', days: ['T', 'Th'], startTime: '10:00', endTime: '11:20', enrolled: 28, capacity: 35, format: 'In-Person' },
      { section: 'B', days: ['T', 'Th'], startTime: '13:30', endTime: '14:50', enrolled: 22, capacity: 35, format: 'In-Person' },
    ],
  },
  {
    id: '20', code: 'INFO 498', title: 'Special Topics in Informatics', instructor: 'Prof. Jessica Hwang',
    days: ['M', 'W'], startTime: '13:30', endTime: '14:50', location: 'MGH 058', format: 'In-Person',
    enrolled: 24, capacity: 30, waitlistCount: 6, credits: 3, subject: 'Informatics', prereqStatus: 'met',
    prerequisites: [{ code: 'INFO 201', title: 'Technical Foundations', status: 'met' }],
    description: 'Advanced special topics in informatics. Topics vary by quarter. Winter 2026: Human-AI Interaction and Design.',
    color: COLORS[1],
    sections: [
      { section: 'A', days: ['M', 'W'], startTime: '13:30', endTime: '14:50', enrolled: 24, capacity: 30, format: 'In-Person' },
    ],
  },
  {
    id: '21', code: 'ARCH 150', title: 'Appreciation of Architecture', instructor: 'Prof. Brian McLaren',
    days: ['T', 'Th'], startTime: '11:30', endTime: '12:50', location: 'ARC 147', format: 'In-Person',
    enrolled: 85, capacity: 100, waitlistCount: 0, credits: 3, subject: 'Architecture', prereqStatus: 'met',
    prerequisites: [],
    description: 'Introduction to architecture as a cultural practice. Explores buildings, landscapes, and urban environments through historical and contemporary examples.',
    color: COLORS[3],
    sections: [
      { section: 'A', days: ['T', 'Th'], startTime: '11:30', endTime: '12:50', enrolled: 85, capacity: 100, format: 'In-Person' },
    ],
  },
];

export const waitlistEntries: WaitlistEntry[] = [
  { id: '1', course: courses[17], section: 'A', position: 5, totalWaitlisted: 15, probability: 'Medium', autoEnroll: true, dateJoined: '2026-02-20', estimatedWait: '~3 days' },
  { id: '2', course: courses[19], section: 'A', position: 2, totalWaitlisted: 6, probability: 'High', autoEnroll: true, dateJoined: '2026-02-25', estimatedWait: '~1 day' },
];

export const currentStudent: Student = {
  id: 'STU-2024-1847',
  name: 'Joseph Chamdani',
  major: 'Informatics',
  gpa: 3.72,
  standing: 'Junior',
  email: 'jchamd@uw.edu',
  academicStatus: 'Good Standing',
  holds: [],
};

export const students: Student[] = [
  currentStudent,
  { id: 'STU-2024-2103', name: 'Maria Garcia', major: 'Data Science', gpa: 3.85, standing: 'Senior', email: 'mgarcia@uw.edu', academicStatus: 'Good Standing', holds: [] },
  { id: 'STU-2024-1592', name: 'Tyler Brown', major: 'Computer Science', gpa: 3.45, standing: 'Sophomore', email: 'tbrown@uw.edu', academicStatus: 'Good Standing', holds: [] },
  { id: 'STU-2024-3001', name: 'Priya Patel', major: 'Mathematics', gpa: 3.91, standing: 'Junior', email: 'ppatel@uw.edu', academicStatus: 'Good Standing', holds: [] },
  { id: 'STU-2024-0892', name: 'Jordan Lee', major: 'Informatics', gpa: 3.28, standing: 'Senior', email: 'jlee@uw.edu', academicStatus: 'Good Standing', holds: ['Library Fine'] },
  { id: 'STU-2024-1755', name: 'Sophia Williams', major: 'Statistics', gpa: 2.85, standing: 'Junior', email: 'swilliams@uw.edu', academicStatus: 'Warning', holds: [] },
  { id: 'STU-2024-2240', name: 'Ethan Kim', major: 'Computer Science', gpa: 3.60, standing: 'Freshman', email: 'ekim@uw.edu', academicStatus: 'Good Standing', holds: [] },
];

export const overrideRequests: OverrideRequest[] = [
  { id: '1', student: students[0], course: courses[5], reason: 'Senior Capstone — missing CS 350 (currently in progress)', date: '2026-03-03', status: 'pending' },
  { id: '2', student: students[1], course: courses[1], reason: 'Graduating senior — need for degree completion', date: '2026-03-02', status: 'pending' },
  { id: '3', student: students[2], course: courses[4], reason: 'Instructor approval obtained via email', date: '2026-03-01', status: 'pending' },
  { id: '4', student: students[3], course: courses[9], reason: 'Completed equivalent coursework at transfer institution', date: '2026-03-02', status: 'pending' },
  { id: '5', student: students[4], course: courses[1], reason: 'Required for Informatics capstone — graduating Winter 2026', date: '2026-02-28', status: 'pending' },
  { id: '6', student: students[5], course: courses[12], reason: 'Taking prerequisite concurrently this quarter', date: '2026-02-27', status: 'pending' },
];

export const auditLog: AuditLogEntry[] = [
  { id: '0a', action: 'SMS Notification Sent', user: 'System', details: 'CS 301 seat available — 5 students notified (5 sent, 0 failed)', timestamp: '2026-03-04 09:20 AM', type: 'alert' },
  { id: '1', action: 'Capacity Updated', user: 'Admin J. Smith', details: 'CS 301: 30 → 35 seats', timestamp: '2026-03-04 09:15 AM', type: 'capacity' },
  { id: '2', action: 'Override Approved', user: 'Dr. Sarah Chen', details: 'Maria Garcia → CS 415', timestamp: '2026-03-04 08:42 AM', type: 'override-approved' },
  { id: '3', action: 'Section Added', user: 'Admin J. Smith', details: 'CS 380 Section 003 created', timestamp: '2026-03-03 04:30 PM', type: 'section' },
  { id: '4', action: 'Capacity Updated', user: 'Admin K. Lee', details: 'STAT 350: 35 → 40 seats', timestamp: '2026-03-03 02:20 PM', type: 'capacity' },
  { id: '5', action: 'Report Generated', user: 'Admin J. Smith', details: 'Winter 2026 Enrollment Summary', timestamp: '2026-03-03 11:05 AM', type: 'report' },
  { id: '6', action: 'Override Denied', user: 'Dr. James Park', details: 'Tyler Brown → CS 415 (prereqs not met)', timestamp: '2026-03-02 03:50 PM', type: 'override-denied' },
  { id: '7', action: 'Course Cancelled', user: 'Admin J. Smith', details: 'PHYS 480 — low enrollment (2 students)', timestamp: '2026-03-02 02:15 PM', type: 'cancellation' },
  { id: '8', action: 'Capacity Updated', user: 'Admin K. Lee', details: 'INFO 340: 30 → 35 seats', timestamp: '2026-03-02 10:30 AM', type: 'capacity' },
  { id: '8a', action: 'SMS Notification Sent', user: 'System', details: 'INFO 340 seat available — 10 students notified (9 sent, 1 failed)', timestamp: '2026-03-02 10:31 AM', type: 'notification' },
  { id: '9', action: 'Override Approved', user: 'Dr. Lisa Wang', details: 'Jordan Lee → CS 380', timestamp: '2026-03-01 04:45 PM', type: 'override-approved' },
  { id: '10', action: 'System Maintenance', user: 'System', details: 'Scheduled maintenance completed — 2:00-4:00 AM', timestamp: '2026-03-01 04:00 AM', type: 'alert' },
  { id: '11', action: 'Capacity Updated', user: 'Admin J. Smith', details: 'CS 415: 20 → 25 seats', timestamp: '2026-02-28 03:20 PM', type: 'capacity' },
  { id: '12', action: 'Override Denied', user: 'Dr. Emily Rodriguez', details: 'Ethan Kim → MATH 310 (prereqs not met)', timestamp: '2026-02-28 11:10 AM', type: 'override-denied' },
];

export const enrollmentData: EnrollmentData[] = [
  { department: 'CS', enrolled: 487, capacity: 560 },
  { department: 'MATH', enrolled: 312, capacity: 400 },
  { department: 'STAT', enrolled: 198, capacity: 280 },
  { department: 'ENG', enrolled: 245, capacity: 300 },
  { department: 'PHIL', enrolled: 156, capacity: 240 },
  { department: 'PHYS', enrolled: 178, capacity: 220 },
  { department: 'BIO', enrolled: 290, capacity: 350 },
  { department: 'INFO', enrolled: 310, capacity: 340 },
];

export const systemAlerts: SystemAlert[] = [
  { id: '1', level: 'critical', message: 'Registration deadline in 2 days (Mar 6)', timestamp: '2026-03-04 08:00 AM' },
  { id: '2', level: 'warning', message: 'CS 490 has low enrollment (12/20) — consider consolidation', timestamp: '2026-03-04 07:30 AM' },
  { id: '3', level: 'info', message: 'Scheduled maintenance tonight 2:00–4:00 AM', timestamp: '2026-03-04 07:00 AM' },
];

export const atRiskIndicators: AtRiskIndicator[] = [
  { category: 'Low Credits', count: 5, description: 'students with <12 credits enrolled' },
  { category: 'Missing Required', count: 3, description: 'students missing required courses for graduation' },
  { category: 'Registration Holds', count: 2, description: 'students with registration holds' },
  { category: 'Waitlist Inaction', count: 2, description: 'students dropped from waitlist (no action taken)' },
];

export const subjects = ['All Subjects', 'Architecture', 'Computer Science', 'English', 'Informatics', 'Mathematics', 'Philosophy', 'Statistics'];
export const instructors = ['All Instructors', 'Dr. Sarah Chen', 'Dr. James Park', 'Dr. Emily Rodriguez', 'Dr. Michael Torres', 'Dr. Lisa Wang', 'Dr. Robert Kim', 'Dr. Anna Foster', 'Prof. David Lee', 'Dr. Kevin Nakamura', 'Prof. Jessica Hwang', 'Dr. Wei Zhang', 'Prof. Rachel Kim', 'Dr. Kevin Lin', 'Prof. David Hendry', 'Prof. Brian McLaren'];
export const formats = ['All Formats', 'In-Person', 'Online', 'Hybrid'];
