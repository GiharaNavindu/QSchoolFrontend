// import * as React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";

// interface Enrollment {
//   enrollmentId: number;
//   courseId: string;
//   course: { name: string };
// }

// interface Module {
//   moduleId: string;
//   name: string;
// }

// interface Lecture {
//   lectureId: number;
//   moduleId: string;
//   module: { name: string } | null; 
//   venue: string;
//   time: string;
// }

// interface AttendanceData {
//   moduleId: string;
//   moduleName: string;
//   attendedLectures: number;
//   totalLectures: number;
// }

// interface StudentAttendanceProps {
//   userId: string;
// }

// const StudentAttendance: React.FC<StudentAttendanceProps> = ({ userId }) => {
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [modules, setModules] = useState<Module[]>([]);
//   const [lectures, setLectures] = useState<Lecture[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<string>("");
//   const [selectedModule, setSelectedModule] = useState<string>("");
//   const [selectedLecture, setSelectedLecture] = useState<string>("");
//   const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   // Fetch enrollments
//   useEffect(() => {
//     const fetchEnrollments = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:8080/api/enroll/student/${userId}`);
//         setEnrollments(response.data);
//         console.log("Fetched Enrollments:", response.data);
//       } catch (err) {
//         setError("Failed to fetch enrollments.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEnrollments();
//   }, [userId]);

//   // Fetch modules when a course is selected
//   useEffect(() => {
//     if (selectedCourse) {
//       const fetchModules = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`http://localhost:8080/api/module/course?courseId=${selectedCourse}`);
//           setModules(response.data);
//           console.log("Fetched Modules:", response.data);
//           setSelectedModule("");
//           setLectures([]);
//           setSelectedLecture("");
//           setAttendanceData([]);
//         } catch (err) {
//           setError("Failed to fetch modules.");
//           console.log("Module fetch error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchModules();
//     }
//   }, [selectedCourse]);

//   // Fetch lectures when a module is selected
//   useEffect(() => {
//     if (selectedModule) {
//       const fetchLectures = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`http://localhost:8080/api/lecture?filterModule=${selectedModule}`);
//           setLectures(response.data.data || []); 
//           console.log("Fetched Lectures:", response.data.data);
//           setSelectedLecture("");
//           setAttendanceData([]);
//         } catch (err) {
//           setError("Failed to fetch lectures.");
//           console.error("Lecture fetch error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchLectures();
//     }
//   }, [selectedModule]);

//   // Fetch attendance when a lecture is selected
//   useEffect(() => {
//     if (selectedLecture) {
//       const fetchAttendance = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`http://localhost:8080/api/attendance/student/${userId}`);
//           setAttendanceData(response.data);
//           console.log("Fetched Attendance Data:", response.data);
//         } catch (err) {
//           setError("Failed to fetch attendance data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchAttendance();
//     }
//   }, [selectedLecture]);

//   return (
//     <div className="p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Track Your Attendance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {loading && <Loader2 className="animate-spin" />}
//           {error && <p className="text-red-500">{error}</p>}
          
//           Course Selection
//           <div className="mb-4">
//             <Select onValueChange={setSelectedCourse} value={selectedCourse}>
//               <SelectTrigger className="w-[200px]">
//                 <SelectValue placeholder="Select Course" />
//               </SelectTrigger>
//               <SelectContent>
//                 {enrollments.map((enrollment) => (
//                   <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
//                     {/* {enrollment.course.name} */}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           Module Selection
//           {selectedCourse && (
//             <div className="mb-4">
//               <Select onValueChange={setSelectedModule} value={selectedModule}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Select Module" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {modules.map((module) => (
//                     <SelectItem key={module.moduleId} value={module.moduleId}>
//                       {module.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Lecture Selection */}
//           {selectedModule && (
//             <div className="mb-4">
//               <Select onValueChange={setSelectedLecture} value={selectedLecture}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Select Lecture" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {lectures.map((lecture) => (
//                     <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
//                       {lecture.module?.name || "Unnamed Module"} - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Attendance Table */}
//           {selectedLecture && attendanceData.length > 0 && (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Module</TableHead>
//                   <TableHead>Attended Lectures</TableHead>
//                   <TableHead>Total Lectures</TableHead>
//                   <TableHead>Attendance Percentage</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {attendanceData
//                   .filter((data) => data.moduleId === selectedModule)
//                   .map((data) => (
//                     <TableRow key={data.moduleId}>
//                       <TableCell>{data.moduleName}</TableCell>
//                       <TableCell>{data.attendedLectures}</TableCell>
//                       <TableCell>{data.totalLectures}</TableCell>
//                       <TableCell>
//                         {((data.attendedLectures / data.totalLectures) * 100).toFixed(2)}%
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudentAttendance;

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080";

interface Enrollment {
  enrollmentId: number;
  courseId: string;
  course: { name: string };
}

interface Module {
  moduleId: string;
  name: string;
}

interface Lecture {
  lectureId: number;
  moduleId: string;
  module: { name: string } | null;
  venue: string;
  time: string;
}

interface Attendance {
  attendanceId: number;
  lecture: {
    lectureId: number;
    module: { name: string };
    venue: string;
    time: string;
  };
  attended: boolean;
  markedAt: string;
}

interface StudentAttendanceProps {
  userId: string;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ userId }) => {
  // State for filtering
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [selectedModule, setSelectedModule] = React.useState<string>("");
  const [selectedLecture, setSelectedLecture] = React.useState<string>("");

  // Fetch enrollments
  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/enroll/student/${userId}`);
      console.log("Fetched Enrollments:", response.data);
      return response.data as Enrollment[];
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch enrollments");
    },
  });

  // Fetch modules when a course is selected
  const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery({
    queryKey: ["modules", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const response = await axios.get(`${API_URL}/api/module/course?courseId=${selectedCourse}`);
      console.log("Fetched Modules:", response.data);
      return response.data as Module[];
    },
    enabled: !!selectedCourse,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch modules");
    },
  });

  // Fetch lectures when a module is selected
  const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useQuery<Lecture[]>({
    queryKey: ["lectures", selectedModule],
    queryFn: async () => {
      if (!selectedModule) return [];
      const response = await axios.get(`${API_URL}/api/lecture?filterModule=${selectedModule}`);
      console.log("Fetched Lectures:", response.data.data);
      return (response.data.data || []) as Lecture[];
    },
    enabled: !!selectedModule,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch lectures");
    },
  });

  // Fetch attendance details for the student
  const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useQuery<Attendance[]>({
    queryKey: ["attendance", userId, selectedLecture],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/attendance/student/${userId}`);
      console.log("Fetched Attendance Details:", response.data);
      return response.data as Attendance[];
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch attendance details");
    },
  });

  // Filter attendance records based on selected lecture or module
  const filteredAttendance = React.useMemo(() => {
    if (!attendance) return [];
    let filtered = attendance;
    if (selectedLecture) {
      filtered = filtered.filter((att) => att.lecture.lectureId === parseInt(selectedLecture));
    } else if (selectedModule) {
      filtered = filtered.filter((att) => att.lecture.moduleId === selectedModule);
    }
    return filtered;
  }, [attendance, selectedLecture, selectedModule]);

  // Reset dependent selections when course changes
  React.useEffect(() => {
    setSelectedModule("");
    setSelectedLecture("");
  }, [selectedCourse]);

  // Reset lecture selection when module changes
  React.useEffect(() => {
    setSelectedLecture("");
  }, [selectedModule]);

  // Combine loading and error states
  const isLoading = enrollmentsLoading || modulesLoading || lecturesLoading || attendanceLoading;
  const error = enrollmentsError || modulesError || lecturesError || attendanceError;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {String(error)}</p>}

          {/* Course Selection */}
          <div className="mb-4">
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {enrollments?.map((enrollment) => (
                  <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
                    {enrollment.courseId || "Unnamed Course"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Module Selection */}
          {selectedCourse && (
            <div className="mb-4">
              <Select onValueChange={setSelectedModule} value={selectedModule}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules?.map((module) => (
                    <SelectItem key={module.moduleId} value={module.moduleId}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Lecture Selection */}
          {selectedModule && (
            <div className="mb-4">
              <Select onValueChange={setSelectedLecture} value={selectedLecture}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Lecture" />
                </SelectTrigger>
                <SelectContent>
                  {(lectures ?? []).map((lecture) => (
                    <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
                      {lecture.name || "Lecture"} - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Attendance Table */}
          {isLoading ? (
            <p>Loading attendance records...</p>
          ) : !selectedCourse ? (
            <p>Please select a course to view your attendance.</p>
          ) : filteredAttendance.length === 0 ? (
            <p>No attendance records found for the selected filters.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lecture ID</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Lecture Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((att) => (
                  <TableRow key={att.attendanceId}>
                    <TableCell>{att.lecture.lectureId}</TableCell>
                    <TableCell>{att.lecture.module?.name || "Unnamed Module"}</TableCell>
                    <TableCell>{att.lecture.venue}</TableCell>
                    <TableCell>{new Date(att.lecture.time).toLocaleString()}</TableCell>
                    <TableCell>{att.attended ? "Present" : "Absent"}</TableCell>
                    <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;