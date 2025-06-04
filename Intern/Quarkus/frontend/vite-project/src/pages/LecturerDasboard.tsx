
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
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LinearScale,
  Title,
} from "chart.js";
import * as React from "react";
import { Bar } from "react-chartjs-2";
import { Attendance, Lecture, Module, Student } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface LecturerDashboardProps {
  userId: string;
}

const API_URL = "http://localhost:8080";

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  // Fetch modules assigned to the lecturer
  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["modules", userId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/module/lecturer/${userId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch modules");
      }
      return response.data;
    },
  });

  // Fetch upcoming lectures for the lecturer
  const { data: lectures, isLoading: lecturesLoading } = useQuery<Lecture[]>({
    queryKey: ["lectures", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/lecture`, {
        params: {
          filterModule: modules?.map((m: Module) => m.moduleId).join(","),
          sortBy: "time",
          sortDir: "asc",
        },
      });
      return response.data.data.filter(
        (lecture: Lecture) => new Date(lecture.time) >= new Date()
      );
    },
    enabled: !!modules,
  });

  // Fetch recent attendance records for the lecturer's lectures
  const { data: attendance, isLoading: attendanceLoading } = useQuery<
    Attendance[]
  >({
    queryKey: ["attendance", userId, modules],
    queryFn: async () => {
      if (!modules) return [];
      // Fetch lectures for all modules
      const lecturePromises = modules.map((module: Module) =>
        axios.get(`${API_URL}/api/lecture`, {
          params: { filterModule: module.moduleId },
        })
      );
      const lectureResponses = await Promise.all(lecturePromises);
      const lectureIds = lectureResponses
        .flatMap((res) => res.data.data)
        .map((lecture: Lecture) => lecture.lectureId);

      // Fetch attendance for these lectures
      const attendancePromises = lectureIds.map((lectureId: number) =>
        axios.get(`${API_URL}/api/attendance/lecture/${lectureId}/details`)
      );
      const attendanceResponses = await Promise.allSettled(attendancePromises);
      const attendanceRecords = attendanceResponses
        .filter(
          (res): res is PromiseFulfilledResult<any> =>
            res.status === "fulfilled"
        )
        .flatMap((res) => res.value.data)
        .sort(
          (a: Attendance, b: Attendance) =>
            new Date(b.markedAt).getTime() - new Date(a.markedAt).getTime()
        )
        .slice(0, 5); // Limit to 5 recent records

      return attendanceRecords;
    },
    enabled: !!modules,
  });

  // Fetch enrolled students across modules
  const { data: students, isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["students", modules],
    queryFn: async () => {
      if (!modules) return [];
      // Fetch lectures for all modules
      const lecturePromises = modules.map((module: Module) =>
        axios.get(`${API_URL}/api/lecture`, {
          params: { filterModule: module.moduleId },
        })
      );
      const lectureResponses = await Promise.all(lecturePromises);
      const lectureIds = lectureResponses
        .flatMap((res) => res.data.data)
        .map((lecture: Lecture) => lecture.lectureId);

      // Fetch enrolled students for these lectures
      const studentPromises = lectureIds.map((lectureId: number) =>
        axios.get(`${API_URL}/api/attendance/lecture/${lectureId}/students`)
      );
      const studentResponses = await Promise.allSettled(studentPromises);
      const uniqueStudents = Array.from(
        new Map(
          studentResponses
            .filter(
              (res): res is PromiseFulfilledResult<any> =>
                res.status === "fulfilled"
            )
            .flatMap((res) => res.value.data)
            .map((student: Student) => [student.studentId, student])
        ).values()
      );
      return uniqueStudents;
    },
    enabled: !!modules,
  });

  // Chart data for attendance trends
  const attendanceChartData = {
    labels: modules?.map((m: Module) => m.name) || [],
    datasets: [
      {
        label: "Attendance Rate (%)",
        data:
          modules?.map((m: Module) => {
            const moduleAttendance = attendance?.filter(
              (a: Attendance) => a.lecture.moduleId === m.moduleId
            );
            const attended =
              moduleAttendance?.filter((a: Attendance) => a.attended).length ||
              0;
            const total = moduleAttendance?.length || 1;
            return Math.round((attended / total) * 100);
          }) || [],
        backgroundColor: "rgba(30, 58, 138, 0.5)", // Matches #1E3A8A with opacity
        borderColor: "#1E3A8A", // Matches #1E3A8A
        borderWidth: 1,
      },
    ],
  };

  const isLoading =
    modulesLoading || lecturesLoading || attendanceLoading || studentsLoading;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#F3F4F6] text-[#111827]">
      <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">
        Lecturer Dashboard
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
          <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
            <CardContent className="pt-6">
              <p className="text-sm text-[#374151]">Total Modules</p>
              <h2 className="text-3xl font-bold text-[#1E3A8A]">
                {modules?.length || 0}
              </h2>
              <p className="text-xs mt-2 text-[#374151]">
                <i className="fas fa-arrow-up mr-1" /> {modules?.length || 0}{" "}
                assigned
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
            <CardContent className="pt-6">
              <p className="text-sm text-[#374151]">Upcoming Lectures</p>
              <h2 className="text-3xl font-bold text-[#1E3A8A]">
                {lectures?.length || 0}
              </h2>
              <p className="text-xs mt-2 text-[#374151]">
                <i className="fas fa-arrow-up mr-1" /> This month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
            <CardContent className="pt-6">
              <p className="text-sm text-[#374151]">Total Students</p>
              <h2 className="text-3xl font-bold text-[#1E3A8A]">
                {students?.length || 0}
              </h2>
              <p className="text-xs mt-2 text-[#374151]">
                <i className="fas fa-arrow-up mr-1" /> Across modules
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-white text-[#111827] shadow-md">
            <CardContent className="pt-6">
              <p className="text-sm text-[#374151]">Attendance Rate</p>
              <h2 className="text-3xl font-bold text-[#1E3A8A]">
                {attendance?.length
                  ? Math.round(
                      (attendance.filter((a: Attendance) => a.attended).length /
                        attendance.length) *
                        100
                    )
                  : 0}
                %
              </h2>
              <p className="text-xs mt-2 text-[#374151]">
                <i className="fas fa-arrow-down mr-1" /> Recent lectures
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-[#F9FAFB] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <Bar
                data={attendanceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: "Attendance by Module",
                      color: "#1E3A8A",
                    },
                  },
                  scales: {
                    y: {
                      ticks: { color: "#374151" },
                      grid: { color: "#E5E7EB" },
                    },
                    x: {
                      ticks: { color: "#374151" },
                      grid: { color: "#E5E7EB" },
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#F9FAFB] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Recent Activity</CardTitle>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
            >
              <a href={`/lecturer/${userId}/attendance`}>View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : attendance?.length > 0 ? (
              <ul className="space-y-4">
                {attendance.map((att: Attendance) => (
                  <li key={att.attendanceId} className="flex items-start">
                    <Badge
                      variant={att.attended ? "default" : "destructive"}
                      className="mr-2 mt-1"
                    >
                      {att.attended ? "P" : "A"}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">
                        {att.student.firstName} {att.student.lastName}
                      </p>
                      <p className="text-xs text-[#374151]">
                        {att.lecture.moduleId} -{" "}
                        {new Date(att.markedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#374151]">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-[#F9FAFB] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Top Students</CardTitle>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
            >
              <a href={`/lecturer/${userId}/students`}>View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : students?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#1E3A8A]">Student ID</TableHead>
                    <TableHead className="text-[#1E3A8A]">Name</TableHead>
                    <TableHead className="text-[#1E3A8A]">Module</TableHead>
                    <TableHead className="text-[#1E3A8A]">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 5).map((student: Student) => {
                    const studentAttendance = attendance?.filter(
                      (att: Attendance) =>
                        att.student.studentId === student.studentId
                    );
                    const attendanceRate = studentAttendance?.length
                      ? Math.round(
                          (studentAttendance.filter(
                            (a: Attendance) => a.attended
                          ).length /
                            studentAttendance.length) *
                            100
                        )
                      : 0;
                    return (
                      <TableRow key={student.studentId}>
                        <TableCell className="text-[#374151]">
                          {student.studentId}
                        </TableCell>
                        <TableCell className="text-[#374151]">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-[#374151]">
                          {modules.find((m: Module) =>
                            studentAttendance?.some(
                              (a: Attendance) =>
                                a.lecture.moduleId === m.moduleId
                            )
                          )?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attendanceRate > 80 ? "default" : "destructive"
                            }
                          >
                            {attendanceRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-[#374151]">No students enrolled.</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#F9FAFB] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#374151]">No upcoming assignments.</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Records */}
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
            <a href={`/lecturer/${userId}/attendance`}>Manage Attendance</a>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : attendance?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#1E3A8A]">Student</TableHead>
                  <TableHead className="text-[#1E3A8A]">Module</TableHead>
                  <TableHead className="text-[#1E3A8A]">Lecture Time</TableHead>
                  <TableHead className="text-[#1E3A8A]">Status</TableHead>
                  <TableHead className="text-[#1E3A8A]">Marked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((att: Attendance) => (
                  <TableRow key={att.attendanceId}>
                    <TableCell className="text-[#374151]">
                      {att.student.firstName} {att.student.lastName}
                    </TableCell>
                    <TableCell className="text-[#374151]">
                      {att.lecture.moduleId}
                    </TableCell>
                    <TableCell className="text-[#374151]">
                      {new Date(att.lecture.time).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={att.attended ? "default" : "destructive"}>
                        {att.attended ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#374151]">
                      {new Date(att.markedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[#374151]">No attendance records.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LecturerDashboard;
