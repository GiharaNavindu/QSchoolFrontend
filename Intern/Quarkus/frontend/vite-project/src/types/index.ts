export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  dob: string;
  address?: string;
  batch?: string;
  enrollments?: Enrolls[];
}

export interface Course {
  courseId: string;
  name: string;
  duration?: number;
  enrollments?: Enrolls[];
  modules?: Module[];
}

export interface Enrolls {
  enrollmentId: number;
  enrollmentDate: string;
  student: Student;
  course: Course;
}

export interface Module {
  moduleId: string;
  name: string;
  numberOfCredits?: number;
  lecturer?: Lecturer;
  courses?: Course[];
  lectures?: Lecture[];
}

export interface Lecturer {
  lecturerId: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  dob: string;
  degree?: string;
  modules?: Module[];
  lectures?: Lecture[];
}

export interface Lecture {
  lectureId: number;
  venue?: string;
  attendanceCount?: number;
  time: string;
  lecturer?: Lecturer;
  module?: Module;
  students?: Student[];
}

export interface AttendanceData {
  moduleId: string;
  moduleName: string;
  attendedLectures: number;
  totalLectures: number;
}

export interface ProgressData {
  completedCredits: number;
  totalCredits: number;
}

export interface UpcomingLecture {
  lectureId: number;
  moduleName: string;
  venue: string;
  time: string;
}

export interface Attendance {
  attendanceId: number;
  student: Student;
  lecture: Lecture;
  attended: boolean;
  markedAt?: string;
}