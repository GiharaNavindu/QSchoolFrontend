// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
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
// import { Pie } from "react-chartjs-2";
// import toast from "react-hot-toast";
// import { Course, Enrolls } from "../types";

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

// const API_URL = "http://localhost:8080";

// const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
//   const effectiveUserId = userId || "S001";

//   // Log userId for debugging
//   React.useEffect(() => {
//     console.log("StudentDashboard mounted with userId from prop:", userId);
//     console.log("Effective userId:", effectiveUserId);
//     if (!userId) {
//       console.warn('No userId provided. Using fallback ID "STU001"');
//       toast.error("No student ID provided. Using fallback.");
//     } else if (!userId.match(/^STU\d{3}$/)) {
//       console.warn(`Invalid userId format: ${userId}`);
//       toast.error("Invalid student ID format. Using fallback ID.");
//     }
//   }, [userId]);

//   // Fetch student profile
//   const {
//     data: student,
//     isLoading: studentLoading,
//     error: studentError,
//   } = useQuery({
//     queryKey: ["student", effectiveUserId],
//     queryFn: async () => {
//       console.log(`Fetching student data for userId: ${effectiveUserId}`);
//       const response = await axios.get(
//         `${API_URL}/api/student/${effectiveUserId}`
//       );
//       console.log("Student data:", response.data);
//       return response.data;
//     },
//   });

//   // Fetch enrollments
//   const {
//     data: enrollments,
//     isLoading: enrollmentsLoading,
//     error: enrollmentsError,
//   } = useQuery({
//     queryKey: ["enrollments", effectiveUserId],
//     queryFn: async () => {
//       console.log(`Fetching enrollments for userId: ${effectiveUserId}`);
//       const response = await axios.get(
//         `${API_URL}/api/enroll/student/${effectiveUserId}`
//       );
//       console.log("Enrollments:", response.data);
//       return response.data; // List<EnrollsDTO>
//     },
//   });

//   // Fetch courses
//   const {
//     data: courses,
//     isLoading: coursesLoading,
//     error: coursesError,
//   } = useQuery({
//     queryKey: ["courses"],
//     queryFn: async () => {
//       console.log("Fetching courses");
//       const response = await axios.get(`${API_URL}/api/course`);
//       console.log("Courses:", response.data.data);
//       return response.data.data; // Course[]
//     },
//   });

//   // Fetch attendance data
//   const {
//     data: attendanceData,
//     isLoading: attendanceLoading,
//     error: attendanceError,
//   } = useQuery({
//     queryKey: ["attendance", effectiveUserId],
//     queryFn: async () => {
//       console.log(`Fetching attendance for userId: ${effectiveUserId}`);
//       const response = await axios.get(
//         `${API_URL}/api/attendance/student/${effectiveUserId}`
//       );
//       console.log("Attendance data:", response.data);
//       return response.data; // AttendanceData[]
//     },
//   });

//   // Fetch progress data
//   const {
//     data: progressData,
//     isLoading: progressLoading,
//     error: progressError,
//   } = useQuery({
//     queryKey: ["progress", effectiveUserId],
//     queryFn: async () => {
//       console.log(`Fetching progress for userId: ${effectiveUserId}`);
//       const response = await axios.get(
//         `${API_URL}/api/student/${effectiveUserId}/progress`
//       );
//       console.log("Progress data:", response.data);
//       return response.data;
//     },
//   });

//   // Prepare data for the enrollment chart
//   const enrollmentChartData = {
//     labels:
//       enrollments?.map((enroll: Enrolls) => {
//         const course = courses?.find(
//           (c: Course) => c.courseId === enroll.courseId
//         );
//         return course?.name || enroll.courseId;
//       }) || [],
//     datasets: [
//       {
//         label: "Credits by Course",
//         data:
//           enrollments?.map((enroll: Enrolls) => {
//             const course = courses?.find(
//               (c: Course) => c.courseId === enroll.courseId
//             );
//             return course?.modules
//               ? course.modules.reduce(
//                   (sum: number, module: any) =>
//                     sum + (module.numberOfCredits || 0),
//                   0
//                 )
//               : 0;
//           }) || [],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   console.log("Enrollment chart data:", enrollmentChartData);

//   // Prepare data for the attendance chart
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
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//       {
//         label: "Total Lectures",
//         data:
//           attendanceData?.map((data: AttendanceData) => data.totalLectures) ||
//           [],
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//         borderColor: "rgba(255, 99, 132, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Check for errors
//   const hasError =
//     studentError ||
//     enrollmentsError ||
//     coursesError ||
//     attendanceError ||
//     progressError;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

//       {studentLoading ||
//       enrollmentsLoading ||
//       coursesLoading ||
//       attendanceLoading ||
//       progressLoading ? (
//         <p>Loading...</p>
//       ) : hasError ? (
//         <p className="text-red-500">
//           Error loading data. Please try again later.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Profile */}
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

//           {/* Enrolled Courses */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Enrolled Courses</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {enrollments?.length > 0 ? (
//                 <ul className="list-disc pl-5">
//                   {enrollments.map((enroll: Enrolls) => {
//                     const course = courses?.find(
//                       (c: Course) => c.courseId === enroll.courseId
//                     );
//                     return (
//                       <li key={enroll.enrollmentId}>
//                         {course?.name || enroll.courseId} (Enrolled:{" "}
//                         {new Date(enroll.enrollmentDate).toLocaleDateString()})
//                       </li>
//                     );
//                   })}
//                 </ul>
//               ) : (
//                 <p>No enrollments found.</p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Attendance Overview */}
//           {/* <Card>
//             <CardHeader>
//               <CardTitle>Attendance Overview</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {attendanceData?.length > 0 ? (
//                 <Bar
//                   data={attendanceChartData}
//                   options={{
//                     plugins: {
//                       title: {
//                         display: true,
//                         text: "Lecture Attendance by Module",
//                       },
//                       legend: { position: "top" },
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         title: { display: true, text: "Lectures" },
//                       },
//                       x: { title: { display: true, text: "Modules" } },
//                     },
//                   }}
//                   height={100}
//                 />
//               ) : (
//                 <p>No attendance data available.</p>
//               )}
//             </CardContent>
//           </Card> */}

//           {/* Course Enrollment Distribution */}
//           {/* Course Enrollment Distribution (Pie Chart) */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Credit Distribution (Pie Chart)</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {enrollments?.length > 0 ? (
//                 <Pie
//                   data={enrollmentChartData}
//                   options={{
//                     plugins: {
//                       title: {
//                         display: true,
//                         text: "Credits by Course (Pie View)",
//                       },
//                       legend: {
//                         position: "right",
//                       },
//                     },
//                   }}
//                   height={200}
//                 />
//               ) : (
//                 <p>No enrollment data available for chart.</p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Academic Progress */}
//           <Card>
//   <CardHeader>
//     <CardTitle>Academic Progress (Pie Chart)</CardTitle>
//   </CardHeader>
//   <CardContent>
//     {progressData ? (
//       <>
//         <Pie
//           data={{
//             labels: ["Completed Credits", "Remaining Credits"],
//             datasets: [
//               {
//                 data: [
//                   progressData.completedCredits,
//                   progressData.totalCredits - progressData.completedCredits,
//                 ],
//                 backgroundColor: [
//                   "rgba(54, 162, 235, 0.6)", // Blue
//                   "rgba(201, 203, 207, 0.6)", // Grey
//                 ],
//                 borderColor: [
//                   "rgba(54, 162, 235, 1)",
//                   "rgba(201, 203, 207, 1)",
//                 ],
//                 borderWidth: 1,
//               },
//             ],
//           }}
//           options={{
//             plugins: {
//               title: {
//                 display: true,
//                 text: "Academic Progress by Credits",
//               },
//               legend: {
//                 position: "bottom",
//               },
//             },
//           }}
//         />
//         <p className="mt-2 text-center font-medium">
//           {progressData.completedCredits} / {progressData.totalCredits} Credits Completed
//         </p>
//       </>
//     ) : (
//       <p>No progress data available.</p>
//     )}
//   </CardContent>
// </Card>


//           {/* Upcoming Lectures */}
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
//                       <TableHead>Lecturer</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingLectures.map((lecture: UpcomingLecture) => (
//                       <TableRow key={lecture.lectureId}>
//                         <TableCell>{lecture.moduleName || lecture.moduleId}</TableCell>
//                         <TableCell>{lecture.venue || "TBA"}</TableCell>
//                         <TableCell>{new Date(lecture.time).toLocaleString()}</TableCell>
//                         <TableCell>{lecture.lecturerName || lecture.lecturerId}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p>No upcoming lectures scheduled.</p>
//               )}
//             </CardContent>
//           </Card> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;



import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Pie, Bar } from "react-chartjs-2";
import toast from "react-hot-toast";
import { Course, Enrolls, AttendanceData } from "../types";
import { motion } from "framer-motion";

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
  const effectiveUserId = userId || "S001";

  // Log userId for debugging
  React.useEffect(() => {
    console.log("StudentDashboard mounted with userId from prop:", userId);
    console.log("Effective userId:", effectiveUserId);
    if (!userId) {
      console.warn('No userId provided. Using fallback ID "STU001"');
      toast.error("No student ID provided. Using fallback.");
    } else if (!userId.match(/^STU\d{3}$/)) {
      console.warn(`Invalid userId format: ${userId}`);
      toast.error("Invalid student ID format. Using fallback ID.");
    }
  }, [userId]);

  // Fetch student profile
  const {
    data: student,
    isLoading: studentLoading,
    error: studentError,
  } = useQuery({
    queryKey: ["student", effectiveUserId],
    queryFn: async () => {
      console.log(`Fetching student data for userId: ${effectiveUserId}`);
      const response = await axios.get(
        `${API_URL}/api/student/${effectiveUserId}`
      );
      console.log("Student data:", response.data);
      return response.data;
    },
  });

  // Fetch enrollments
  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useQuery({
    queryKey: ["enrollments", effectiveUserId],
    queryFn: async () => {
      console.log(`Fetching enrollments for userId: ${effectiveUserId}`);
      const response = await axios.get(
        `${API_URL}/api/enroll/student/${effectiveUserId}`
      );
      console.log("Enrollments:", response.data);
      return response.data; // List<EnrollsDTO>
    },
  });

  // Fetch courses
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("Fetching courses");
      const response = await axios.get(`${API_URL}/api/course`);
      console.log("Courses:", response.data.data);
      return response.data.data; // Course[]
    },
  });

  // Fetch attendance data
  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useQuery({
    queryKey: ["attendance", effectiveUserId],
    queryFn: async () => {
      console.log(`Fetching attendance for userId: ${effectiveUserId}`);
      const response = await axios.get(
        `${API_URL}/api/attendance/student/${effectiveUserId}`
      );
      console.log("Attendance data:", response.data);
      return response.data; // AttendanceData[]
    },
  });

  // Fetch progress data
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
  } = useQuery({
    queryKey: ["progress", effectiveUserId],
    queryFn: async () => {
      console.log(`Fetching progress for userId: ${effectiveUserId}`);
      const response = await axios.get(
        `${API_URL}/api/student/${effectiveUserId}/progress`
      );
      console.log("Progress data:", response.data);
      return response.data;
    },
  });

  // Prepare data for the enrollment chart
  const enrollmentChartData = {
    labels:
      enrollments?.map((enroll: Enrolls) => {
        const course = courses?.find(
          (c: Course) => c.courseId === enroll.courseId
        );
        return course?.name || enroll.courseId;
      }) || [],
    datasets: [
      {
        label: "Credits by Course",
        data:
          enrollments?.map((enroll: Enrolls) => {
            const course = courses?.find(
              (c: Course) => c.courseId === enroll.courseId
            );
            return course?.modules
              ? course.modules.reduce(
                  (sum: number, module: any) =>
                    sum + (module.numberOfCredits || 0),
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

  // Prepare data for the attendance chart
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
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Lectures",
        data:
          attendanceData?.map((data: AttendanceData) => data.totalLectures) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Check for errors
  const isLoading =
    studentLoading ||
    enrollmentsLoading ||
    coursesLoading ||
    attendanceLoading ||
    progressLoading;

  const hasError =
    studentError ||
    enrollmentsError ||
    coursesError ||
    attendanceError ||
    progressError;

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#F3F4F6] text-[#111827]">
      <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">
        Student Dashboard
      </h1>

      {/* Metrics Widgets */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151]">Enrolled Courses</p>
                <h2 className="text-3xl font-bold text-[#1E3A8A]">
                  {enrollments?.length || 0}
                </h2>
                <p className="text-xs mt-2 text-[#374151]">
                  <i className="fas fa-arrow-up mr-1" /> This semester
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151]">Attendance Rate</p>
                <h2 className="text-3xl font-bold text-[#1E3A8A]">
                  {attendanceData?.length
                    ? Math.round(
                        (attendanceData.reduce(
                          (sum: number, data: AttendanceData) =>
                            sum + data.attendedLectures,
                          0
                        ) /
                          attendanceData.reduce(
                            (sum: number, data: AttendanceData) =>
                              sum + data.totalLectures,
                            0
                          )) * 100
                      )
                    : 0}
                  %
                </h2>
                <p className="text-xs mt-2 text-[#374151]">
                  <i className="fas fa-arrow-up mr-1" /> Across modules
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151]">Completed Credits</p>
                <h2 className="text-3xl font-bold text-[#1E3A8A]">
                  {progressData?.completedCredits || 0}
                </h2>
                <p className="text-xs mt-2 text-[#374151]">
                  <i className="fas fa-arrow-up mr-1" /> of {progressData?.totalCredits || 0}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151]">Progress</p>
                <h2 className="text-3xl font-bold text-[#1E3A8A]">
                  {progressData?.totalCredits
                    ? Math.round(
                        (progressData.completedCredits / progressData.totalCredits) * 100
                      )
                    : 0}
                  %
                </h2>
                <p className="text-xs mt-2 text-[#374151]">
                  <i className="fas fa-arrow-up mr-1" /> Toward degree
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Charts and Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="lg:col-span-2 bg-[#F9FAFB] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">
                Attendance by Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : attendanceData?.length > 0 ? (
                <Bar
                  data={attendanceChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: {
                        display: true,
                        text: "Lecture Attendance by Module",
                        color: "#1E3A8A",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: "#374151" },
                        grid: { color: "#E5E7EB" },
                        title: { display: true, text: "Lectures", color: "#374151" },
                      },
                      x: {
                        ticks: { color: "#374151" },
                        grid: { color: "#E5E7EB" },
                        title: { display: true, text: "Modules", color: "#374151" },
                      },
                    },
                  }}
                  height={100}
                />
              ) : (
                <p className="text-sm text-[#374151]">
                  No attendance data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-[#F9FAFB] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Profile</CardTitle>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
              >
                <a href={`/student/${effectiveUserId}/profile`}>Edit Profile</a>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : student ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {student.firstName} {student.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Batch:</strong> {student.batch || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#374151]">
                  No profile data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Course Enrollment and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="lg:col-span-2 bg-[#F9FAFB] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">
                Course Enrollment
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
              >
                <a href={`/student/${effectiveUserId}/courses`}>View All Courses</a>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : enrollments?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1E3A8A]">
                        Course Name
                      </TableHead>
                      <TableHead className="text-[#1E3A8A]">
                        Enrollment Date
                      </TableHead>
                      <TableHead className="text-[#1E3A8A]">
                        Credits
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enroll: Enrolls) => {
                      const course = courses?.find(
                        (c: Course) => c.courseId === enroll.courseId
                      );
                      const credits = course?.modules
                        ? course.modules.reduce(
                            (sum: number, module: any) =>
                              sum + (module.numberOfCredits || 0),
                            0
                          )
                        : 0;
                      return (
                        <TableRow key={enroll.enrollmentId}>
                          <TableCell className="text-[#374151]">
                            {course?.name || enroll.courseId}
                          </TableCell>
                          <TableCell className="text-[#374151]">
                            {new Date(enroll.enrollmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-[#374151]">
                            {credits}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-[#374151]">
                  No enrollments found.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-[#F9FAFB] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">
                Academic Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : progressData ? (
                <>
                  <Pie
                    data={{
                      labels: ["Completed Credits", "Remaining Credits"],
                      datasets: [
                        {
                          data: [
                            progressData.completedCredits,
                            progressData.totalCredits - progressData.completedCredits,
                          ],
                          backgroundColor: [
                            "rgba(54, 162, 235, 0.6)", // Blue
                            "rgba(201, 203, 207, 0.6)", // Grey
                          ],
                          borderColor: [
                            "rgba(54, 162, 235, 1)",
                            "rgba(201, 203, 207, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: "Academic Progress by Credits",
                          color: "#1E3A8A",
                        },
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                    height={200}
                  />
                  <p className="mt-4 text-center font-medium text-[#374151]">
                    {progressData.completedCredits} / {progressData.totalCredits} Credits Completed
                  </p>
                </>
              ) : (
                <p className="text-sm text-[#374151]">
                  No progress data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Attendance Records */}
      <motion.div custom={8} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="bg-[#F9FAFB] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">
              Recent Attendance Records
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
            >
              <a href={`/student/${effectiveUserId}/attendance`}>View All Attendance</a>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : attendanceData?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#1E3A8A]">
                      Module
                    </TableHead>
                    <TableHead className="text-[#1E3A8A]">
                      Attended Lectures
                    </TableHead>
                    <TableHead className="text-[#1E3A8A]">
                      Total Lectures
                    </TableHead>
                    <TableHead className="text-[#1E3A8A]">
                      Attendance Rate
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((data: AttendanceData, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-[#374151]">
                        {data.moduleName}
                      </TableCell>
                      <TableCell className="text-[#374151]">
                        {data.attendedLectures}
                      </TableCell>
                      <TableCell className="text-[#374151]">
                        {data.totalLectures}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            (data.attendedLectures / data.totalLectures) * 100 > 80
                              ? "default"
                              : "destructive"
                          }
                        >
                          {Math.round(
                            (data.attendedLectures / data.totalLectures) * 100
                          ) || 0}
                          %
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-[#374151]">
                No attendance records available.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;