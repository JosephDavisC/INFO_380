export type DayOfWeek = 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sat';
export type Format = 'In-Person' | 'Online' | 'Hybrid';
export type PrereqStatus = 'met' | 'in-progress' | 'not-met';
export type WaitlistProbability = 'High' | 'Medium' | 'Low';

export interface Prerequisite {
  code: string;
  title: string;
  status: PrereqStatus;
}

export interface CourseSection {
  section: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  enrolled: number;
  capacity: number;
  format: Format;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  location: string;
  format: Format;
  enrolled: number;
  capacity: number;
  waitlistCount: number;
  credits: number;
  subject: string;
  prereqStatus: PrereqStatus;
  prerequisites: Prerequisite[];
  description: string;
  color: string;
  crossListed?: string[];
  sections?: CourseSection[];
  corequisites?: string[];
}

export interface WaitlistEntry {
  id: string;
  course: Course;
  section: string;
  position: number;
  totalWaitlisted: number;
  probability: WaitlistProbability;
  autoEnroll: boolean;
  dateJoined: string;
  estimatedWait: string;
}

export interface Student {
  id: string;
  name: string;
  major: string;
  gpa: number;
  standing: string;
  email: string;
  academicStatus: 'Good Standing' | 'Probation' | 'Warning';
  holds: string[];
}

export interface OverrideRequest {
  id: string;
  student: Student;
  course: Course;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'capacity' | 'override-approved' | 'override-denied' | 'section' | 'report' | 'alert' | 'cancellation' | 'notification';
}

export interface EnrollmentData {
  department: string;
  enrolled: number;
  capacity: number;
}

export interface SystemAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export interface AtRiskIndicator {
  category: string;
  count: number;
  description: string;
}
