import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import toast from "react-hot-toast";
import { Course, Enrolls } from "../types";

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
  const effectiveUserId = userId || "STU001";

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
  const hasError =
    studentError ||
    enrollmentsError ||
    coursesError ||
    attendanceError ||
    progressError;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="mb-4">Logged in as Student ID: {effectiveUserId}</p>

      {studentLoading ||
      enrollmentsLoading ||
      coursesLoading ||
      attendanceLoading ||
      progressLoading ? (
        <p>Loading...</p>
      ) : hasError ? (
        <p className="text-red-500">
          Error loading data. Please try again later.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile */}
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

          {/* Enrolled Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {enrollments.map((enroll: Enrolls) => {
                    const course = courses?.find(
                      (c: Course) => c.courseId === enroll.courseId
                    );
                    return (
                      <li key={enroll.enrollmentId}>
                        {course?.name || enroll.courseId} (Enrolled:{" "}
                        {new Date(enroll.enrollmentDate).toLocaleDateString()})
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No enrollments found.</p>
              )}
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceData?.length > 0 ? (
                <Bar
                  data={attendanceChartData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Lecture Attendance by Module",
                      },
                      legend: { position: "top" },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Lectures" },
                      },
                      x: { title: { display: true, text: "Modules" } },
                    },
                  }}
                  height={100}
                />
              ) : (
                <p>No attendance data available.</p>
              )}
            </CardContent>
          </Card> */}

          {/* Course Enrollment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
  {enrollments?.length > 0 ? (
    <Bar
      data={enrollmentChartData}
      options={{
        indexAxis: "x", // ensures vertical bars
        plugins: {
          title: { display: true, text: "Credits by Course" },
          legend: { display: false },
        },
        responsive: true,
        maintainAspectRatio: false,
      }}
      height={200}
    />
  ) : (
    <p>No enrollment data available for chart.</p>
  )}
</CardContent>
          </Card>

          {/* Academic Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {progressData ? (
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
              ) : (
                <p>No progress data available.</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Lectures */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Upcoming Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingLectures?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Lecturer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingLectures.map((lecture: UpcomingLecture) => (
                      <TableRow key={lecture.lectureId}>
                        <TableCell>{lecture.moduleName || lecture.moduleId}</TableCell>
                        <TableCell>{lecture.venue || "TBA"}</TableCell>
                        <TableCell>{new Date(lecture.time).toLocaleString()}</TableCell>
                        <TableCell>{lecture.lecturerName || lecture.lecturerId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No upcoming lectures scheduled.</p>
              )}
            </CardContent>
          </Card> */}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
