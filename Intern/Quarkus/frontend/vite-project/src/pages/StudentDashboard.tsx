// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Student, Enrolls } from '../types/index';

// interface StudentDashboardProps {
//   userId: string;
// }

// const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
//   const [student, setStudent] = useState<Student | null>(null);
//   const [enrollments, setEnrollments] = useState<Enrolls[]>([]);

//   useEffect(() => {
//     axios.get(`http://localhost:8080/api/student/${userId}`)
//       .then(res => setStudent(res.data))
//       .catch(err => console.error(err));
//     axios.get(`http://localhost:8080/api/enrolls/student/${userId}`)
//       .then(res => setEnrollments(res.data))
//       .catch(err => console.error(err));
//   }, [userId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
//       {student && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Profile</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
//               <p><strong>Email:</strong> {student.email}</p>
//               <p><strong>Batch:</strong> {student.batch || 'N/A'}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Enrolled Courses</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {enrollments.length > 0 ? (
//                 <ul className="list-disc pl-5">
//                   {enrollments.map(enroll => (
//                     <li key={enroll.enrollmentId}>
//                       {enroll.course.name} (Enrolled: {enroll.enrollmentDate})
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No enrollments found.</p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  AttendanceData,
  Enrolls,
  ProgressData,
  Student,
  UpcomingLecture,
} from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StudentDashboardProps {
  userId: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrolls[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [upcomingLectures, setUpcomingLectures] = useState<UpcomingLecture[]>(
    []
  );

  useEffect(() => {
    // Fetch student profile
    axios
      .get(`http://localhost:8080/api/student/${userId}`)
      .then((res) => setStudent(res.data))
      .catch((err) => console.error(err));

    // Fetch enrollments
    axios
      .get(`http://localhost:8080/api/enrolls/student/${userId}`)
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error(err));

    // Fetch attendance data
    axios
      .get(`http://localhost:8080/api/16/attendance/${userId}`)
      .then((res) => setAttendanceData(res.data))
      .catch((err) => console.error(err));

    // Fetch progress data
    axios
      .get(`http://localhost:8080/api/student/${userId}/progress`)
      .then((res) => setProgressData(res.data))
      .catch((err) => console.error(err));

    // Fetch upcoming lectures
    axios
      .get(`http://localhost:8080/api/lecture/student/${userId}/upcoming`)
      .then((res) => setUpcomingLectures(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  // Attendance Bar Chart Data
  const attendanceChartData = {
    labels: attendanceData.map((data) => data.moduleName),
    datasets: [
      {
        label: "Attended Lectures",
        data: attendanceData.map((data) => data.attendedLectures),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Total Lectures",
        data: attendanceData.map((data) => data.totalLectures),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Enrollment Pie Chart Data
  const enrollmentChartData = {
    labels: enrollments.map((enroll) => enroll.course.name),
    datasets: [
      {
        data: enrollments.map(
          (enroll) =>
            enroll.course.modules?.reduce(
              (sum, module) => sum + (module.numberOfCredits || 0),
              0
            ) || 0
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {student && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Name:</strong> {student.firstName} {student.lastName}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Batch:</strong> {student.batch || "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <ul className="list-disc pl-5">
                  {enrollments.map((enroll) => (
                    <li key={enroll.enrollmentId}>
                      {enroll.course.name} (Enrolled: {enroll.enrollmentDate})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No enrollments found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={attendanceChartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Lecture Attendance by Module",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Lectures" },
                    },
                  },
                }}
                height={100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={enrollmentChartData}
                options={{
                  plugins: {
                    title: { display: true, text: "Credits by Course" },
                  },
                }}
                height={100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {progressData && (
                <>
                  <Progress
                    value={
                      (progressData.completedCredits /
                        progressData.totalCredits) *
                      100
                    }
                  />
                  <p className="mt-2">
                    {progressData.completedCredits} /{" "}
                    {progressData.totalCredits} Credits Completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingLectures.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingLectures.map((lecture) => (
                      <TableRow key={lecture.lectureId}>
                        <TableCell>{lecture.moduleName}</TableCell>
                        <TableCell>{lecture.venue}</TableCell>
                        <TableCell>{lecture.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No upcoming lectures.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
