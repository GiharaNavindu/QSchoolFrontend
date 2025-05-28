// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip,
// } from "chart.js";
// import * as React from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import { AttendanceData, Enrolls, UpcomingLecture } from "../types";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// interface StudentDashboardProps {
//   userId: string;
// }

// const API_URL =  "http://localhost:8080";

// const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
//   const { data: student, isLoading: studentLoading } = useQuery({
//     queryKey: ["student", userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/student/${userId}`);
//       return response.data;
//     },
//   });

//   const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
//     queryKey: ["enrollments", userId],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${API_URL}/api/enroll/student/${userId}`
//       );
//       return response.data;
//     },
//   });

//   const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
//     queryKey: ["attendance", userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/attendance/${userId}`);
//       return response.data;
//     },
//   });

//   const { data: progressData, isLoading: progressLoading } = useQuery({
//     queryKey: ["progress", userId],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${API_URL}/api/student/${userId}/progress`
//       );
//       return response.data;
//     },
//   });

//   // const { data: upcomingLectures, isLoading: lecturesLoading } = useQuery({
//   //   queryKey: ["upcomingLectures", userId],
//   //   queryFn: async () => {
//   //     const response = await axios.get(
//   //       `${API_URL}/api/lecture/student/${userId}/upcoming`
//   //     );
//   //     return response.data;
//   //   },
//   // });

//   const attendanceChartData = {
//     labels:
//       attendanceData?.map((data: AttendanceData) => data.moduleName) || [],
//     datasets: [
//       {
//         label: "Attended Lectures",
//         data:
//           attendanceData?.map(
//             (data: AttendanceData) => data.attendedLectures
//           ) || [],
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//       {
//         label: "Total Lectures",
//         data:
//           attendanceData?.map((data: AttendanceData) => data.totalLectures) ||
//           [],
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//       },
//     ],
//   };

//   const enrollmentChartData = {
//     labels: enrollments?.map((enroll: Enrolls) => enroll.course) || [],
//     datasets: [
//       {
//         data:
//           enrollments?.map(
//             (enroll: Enrolls) =>
//               enroll.course.modules
//                 ? enroll.course.modules.reduce(
//                     (sum, module) => sum + (module.numberOfCredits || 0),
//                     0
//                   )
//                 : 0
//           ) || [],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//         ],
//       },
//     ],
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
//       {studentLoading ||
//       enrollmentsLoading ||
//       attendanceLoading ||
//       progressLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Profile</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>
//                 <strong>Name:</strong> {student?.firstName} {student?.lastName}
//               </p>
//               <p>
//                 <strong>Email:</strong> {student?.email}
//               </p>
//               <p>
//                 <strong>Batch:</strong> {student?.batch || "N/A"}
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Enrolled Courses</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {enrollments?.length > 0 ? (
//                 <ul className="list-disc pl-5">
//                   {/* {enrollments.map((enroll: Enrolls) => (
//                     <li key={enroll.enrollmentId}>
//                       {enroll.course.name} (Enrolled: {enroll.enrollmentDate})
//                     </li>
//                   ))} */}
//                 </ul>
//               ) : (
//                 <p>No enrollments found.</p>
//               )}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Attendance Overview</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Bar
//                 data={attendanceChartData}
//                 options={{
//                   plugins: {
//                     title: {
//                       display: true,
//                       text: "Lecture Attendance by Module",
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       title: { display: true, text: "Lectures" },
//                     },
//                   },
//                 }}
//                 height={100}
//               />
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Enrollment Distribution</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {/* <Pie
//                 data={enrollmentChartData}
//                 options={{
//                   plugins: {
//                     title: { display: true, text: "Credits by Course" },
//                   },
//                 }}
//                 height={100}
//               /> */}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Academic Progress</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {progressData && (
//                 <>
//                   <Progress
//                     value={
//                       (progressData.completedCredits /
//                         progressData.totalCredits) *
//                       100
//                     }
//                   />
//                   <p className="mt-2">
//                     {progressData.completedCredits} /{" "}
//                     {progressData.totalCredits} Credits Completed
//                   </p>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//           {/* <Card>
//             <CardHeader>
//               <CardTitle>Upcoming Lectures</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {upcomingLectures?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Module</TableHead>
//                       <TableHead>Venue</TableHead>
//                       <TableHead>Time</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingLectures.map((lecture: UpcomingLecture) => (
//                       <TableRow key={lecture.lectureId}>
//                         <TableCell>{lecture.moduleName}</TableCell>
//                         <TableCell>{lecture.venue}</TableCell>
//                         <TableCell>
//                           {new Date(lecture.time).toLocaleString()}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p>No upcoming lectures.</p>
//               )}
//             </CardContent>
//           </Card> */}
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
import { useQuery } from "@tanstack/react-query";
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
import { Bar, Pie } from "react-chartjs-2";
import { AttendanceData, Course, Enrolls, UpcomingLecture } from "../types";

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

const API_URL = "http://localhost:8080";

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["student", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/student/${userId}`);
      return response.data;
    },
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/enroll/student/${userId}`
      );
      return response.data; // List<EnrollsDTO>
    },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/course`);
      return response.data.data; // Course[]
    },
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/attendance/${userId}`);
      return response.data;
    },
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/student/${userId}/progress`
      );
      return response.data;
    },
  });

  // Prepare data for the enrollment chart
  const enrollmentChartData = {
    labels:
      enrollments?.map((enroll: Enrolls) => {
        const course = courses?.find((c: Course) => c.courseId === enroll.courseId);
        return course?.name || enroll.courseId;
      }) || [],
    datasets: [
      {
        label: "Credits by Course",
        data:
          enrollments?.map((enroll: Enrolls) => {
            const course = courses?.find((c: Course) => c.courseId === enroll.courseId);
            return course?.modules
              ? course.modules.reduce(
                  (sum, module) => sum + (module.numberOfCredits || 0),
                  0
                )
              : 0;
          }) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const attendanceChartData = {
    labels:
      attendanceData?.map((data: AttendanceData) => data.moduleName) || [],
    datasets: [
      {
        label: "Attended Lectures",
        data:
          attendanceData?.map(
            (data: AttendanceData) => data.attendedLectures
          ) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Total Lectures",
        data:
          attendanceData?.map((data: AttendanceData) => data.totalLectures) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {studentLoading ||
      enrollmentsLoading ||
      coursesLoading ||
      attendanceLoading ||
      progressLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Name:</strong> {student?.firstName} {student?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {student?.email}
              </p>
              <p>
                <strong>Batch:</strong> {student?.batch || "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {enrollments.map((enroll: Enrolls) => {
                    const course = courses?.find((c: Course) => c.courseId === enroll.courseId);
                    return (
                      <li key={enroll.enrollmentId}>
                        {course?.name || enroll.courseId} (Enrolled: {enroll.enrollmentDate})
                      </li>
                    );
                  })}
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
              {enrollments?.length > 0 ? (
                <Pie
                  data={enrollmentChartData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Credits by Course",
                      },
                      legend: {
                        position: "right",
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                  height={200}
                />
              ) : (
                <p>No enrollment data available for chart.</p>
              )}
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
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;