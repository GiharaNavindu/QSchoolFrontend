

export interface Course {
  courseId: string;
  name: string;
  duration?: number;
}

export interface Enrolls {
  enrollmentId: number;
  enrollmentDate: string;
  studentId: string;
  courseId: string;
}

export interface Module {
  moduleId: string;
  name: string;
  numberOfCredits: number;
  lecturerId?: string;
}

export interface Lecturer {
  lecturerId: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  dob?: string;
  degree?: string;
}

export interface Lecture {
  lectureId: number;
  venue?: string;
  time: string;
  lecturerId: string;
  moduleId: string;
}

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  dob?: string;
  address?: string;
  batch?: string;
}

export interface Attendance {
  attendanceId: number;
  student: Student;
  lecture: Lecture;
  attended: boolean;
  markedAt?: string;
}

export interface MarkAttendance {
  student: { studentId: string };
  lecture: { lectureId: number };
  attended: boolean;
}

export interface UpcomingLecture {
  lectureId: number;
  moduleName: string;
  venue: string;
  time: string;
}

export interface ProgressData {
  completedCredits: number;
  totalCredits: number;
}