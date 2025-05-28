// import * as React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Module, Lecture } from '../types';

// interface LecturerDashboardProps {
//   userId: string;
// }



// const API_URL =  'http://localhost:8080';

// const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
//   const { data: modules, isLoading: modulesLoading } = useQuery({
//     queryKey: ['modules', userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/module/lecturer/${userId}`);
//       return response.data;
//     },
//   });

//   const { data: lectures, isLoading: lecturesLoading } = useQuery({
//     queryKey: ['lectures', userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/lecture`, {
//         params: { filterModule: modules?.map((m: Module) => m.moduleId).join(',') },
//       });
//       return response.data.data.filter((lecture: Lecture) => new Date(lecture.time) >= new Date());
//     },
//     enabled: !!modules,
//   });

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Lecturer Dashboard</h1>
//       {(modulesLoading || lecturesLoading) ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Assigned Modules</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {modules?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Module ID</TableHead>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Credits</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {modules.map((module: Module) => (
//                       <TableRow key={module.moduleId}>
//                         <TableCell>{module.moduleId}</TableCell>
//                         <TableCell>{module.name}</TableCell>
//                         <TableCell>{module.numberOfCredits}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p>No modules assigned.</p>
//               )}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Upcoming Lectures</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {lectures?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Module</TableHead>
//                       <TableHead>Venue</TableHead>
//                       <TableHead>Time</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {lectures.map((lecture: Lecture) => (
//                       <TableRow key={lecture.lectureId}>
//                         <TableCell>{lecture.module?.name}</TableCell>
//                         <TableCell>{lecture.venue || 'N/A'}</TableCell>
//                         <TableCell>{new Date(lecture.time).toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p>No upcoming lectures.</p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LecturerDashboard;


import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Module, Lecture, Attendance, Student, Assignment } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface LecturerDashboardProps {
  userId: string;
}

const API_URL = 'http://localhost:8080';

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  // Fetch modules
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/module/lecturer/${userId}`);
      return response.data;
    },
  });

  // Fetch upcoming lectures
  const { data: lectures, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/lecture`, {
        params: { filterModule: modules?.map((m: Module) => m.moduleId).join(',') },
      });
      return response.data.data.filter(
        (lecture: Lecture) => new Date(lecture.time) >= new Date()
      );
    },
    enabled: !!modules,
  });

  // Fetch recent attendance
  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/attendance/lecturer/${userId}`);
      return response.data.slice(0, 5); // Limit to 5 recent records
    },
  });

  // Fetch enrolled students (aggregate across modules)
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', modules],
    queryFn: async () => {
      if (!modules) return [];
      const studentPromises = modules.map((module: Module) =>
        axios.get(`${API_URL}/api/student/module/${module.moduleId}`)
      );
      const responses = await Promise.all(studentPromises);
      const uniqueStudents = Array.from(
        new Map(
          responses
            .flatMap((res) => res.data)
            .map((student: Student) => [student.studentId, student])
        ).values()
      );
      return uniqueStudents;
    },
    enabled: !!modules,
  });

  // Fetch upcoming assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/assignment/lecturer/${userId}`);
      return response.data.filter(
        (assignment: Assignment) => new Date(assignment.dueDate) >= new Date()
      );
    },
  });

  // Chart data for attendance trends
  const attendanceChartData = {
    labels: modules?.map((m: Module) => m.name) || [],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: modules?.map((m: Module) => {
          const moduleAttendance = attendance?.filter(
            (a: Attendance) => a.lecture.module.moduleId === m.moduleId
          );
          const attended = moduleAttendance?.filter((a: Attendance) => a.attended).length || 0;
          const total = moduleAttendance?.length || 1;
          return Math.round((attended / total) * 100);
        }) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const isLoading =
    modulesLoading ||
    lecturesLoading ||
    attendanceLoading ||
    studentsLoading ||
    assignmentsLoading;

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">Lecturer Dashboard</h1>

        {/* Metrics Widgets */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <p className="text-sm">Total Modules</p>
                <h2 className="text-3xl font-bold">{modules?.length || 0}</h2>
                <p className="text-xs mt-2">
                  <i className="fas fa-arrow-up mr-1" /> {modules?.length || 0} assigned
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <p className="text-sm">Upcoming Lectures</p>
                <h2 className="text-3xl font-bold">{lectures?.length || 0}</h2>
                <p className="text-xs mt-2">
                  <i className="fas fa-arrow-up mr-1" /> This month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <p className="text-sm">Total Students</p>
                <h2 className="text-3xl font-bold">{students?.length || 0}</h2>
                <p className="text-xs mt-2">
                  <i className="fas fa-arrow-up mr-1" /> Across modules
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <p className="text-sm">Attendance Rate</p>
                <h2 className="text-3xl font-bold">
                  {attendance?.length
                    ? Math.round(
                        (attendance.filter((a: Attendance) => a.attended).length /
                          attendance.length) *
                          100
                      )
                    : 0}
                  %
                </h2>
                <p className="text-xs mt-2">
                  <i className="fas fa-arrow-down mr-1" /> Recent lectures
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
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
                      legend: { position: 'top' },
                      title: { display: true, text: 'Attendance by Module' },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/lecturer/attendance">View All</a>
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
                        variant={att.attended ? 'default' : 'destructive'}
                        className="mr-2 mt-1"
                      >
                        {att.attended ? 'P' : 'A'}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          {att.student.firstName} {att.student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {att.lecture.module.name} -{' '}
                          {new Date(att.markedAt).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Students and Upcoming Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Students</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/lecturer/students">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : students?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 5).map((student: Student) => {
                      const studentAttendance = attendance?.filter(
                        (att: Attendance) => att.student.studentId === student.studentId
                      );
                      const attendanceRate = studentAttendance?.length
                        ? Math.round(
                            (studentAttendance?.data?.filter((a: Attendance) => a.attended).length)
                            / studentAttendance.length * 100
                          )
                        : 0;
                      return (
                        <TableRow key={student.studentId}>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>
                            {modules
                              .find((m: Module) =>
                                studentAttendance?.some(
                                  (a: Attendance) => a.lecture.module.moduleId === m.moduleId
                                )
                              )?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={attendanceRate > 80 ? 'success' : 'warning'}>
                              {attendanceRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No students enrolled.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : assignments?.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment: Assignment) => (
                    <div key={assignment.assignmentId}>
                      <p className="text-sm font-medium">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <Progress
                        value={
                          (new Date().getTime() - new Date(assignment.createdAt).getTime()) /
                          (new Date(assignment.dueDate).getTime() -
                            new Date(assignment.createdAt).getTime()) *
                          100
                        }
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/lecturer/attendance">Manage Attendance</a>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : attendance?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Lecture Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((att: Attendance) => (
                    <TableRow key={att.attendanceId}>
                      <TableCell>
                        {att.student.firstName} {att.student.lastName}
                      </TableCell>
                      <TableCell>{att.lecture.module.name}</TableCell>
                      <TableCell>{new Date(att.lecture.time).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={att.attended ? 'success' : 'destructive'}>
                          {att.attended ? 'Present' : 'Absent'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No attendance records.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default LecturerDashboard;