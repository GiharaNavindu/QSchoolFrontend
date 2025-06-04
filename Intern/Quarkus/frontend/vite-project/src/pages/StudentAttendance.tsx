
// // import * as React from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import axios from "axios";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import toast from "react-hot-toast";

// // const API_URL = "http://localhost:8080";

// // interface Enrollment {
// //   enrollmentId: number;
// //   courseId: string;
// //   course: { name: string };
// // }

// // interface Module {
// //   moduleId: string;
// //   name: string;
// // }

// // interface Lecture {
// //   lectureId: number;
// //   moduleId: string;
// //   module: { name: string } | null;
// //   venue: string;
// //   time: string;
// // }

// // interface Attendance {
// //   attendanceId: number;
// //   lecture: {
// //     lectureId: number;
// //     module: { name: string };
// //     venue: string;
// //     time: string;
// //   };
// //   attended: boolean;
// //   markedAt: string;
// // }

// // interface StudentAttendanceProps {
// //   userId: string;
// // }

// // const StudentAttendance: React.FC<StudentAttendanceProps> = ({ userId }) => {
// //   // State for filtering
// //   const [selectedCourse, setSelectedCourse] = React.useState<string>("");
// //   const [selectedModule, setSelectedModule] = React.useState<string>("");
// //   const [selectedLecture, setSelectedLecture] = React.useState<string>("");

// //   // Fetch enrollments
// //   const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery<Enrollment[], Error>({
// //     queryKey: ["enrollments", userId],
// //     queryFn: async () => {
// //       const response = await axios.get(`${API_URL}/api/enroll/student/${userId}`);
// //       console.log("Fetched Enrollments:", response.data);
// //       return response.data as Enrollment[];
// //     },
// //     onError: (err: any) => {
// //       toast.error(err.response?.data?.message || "Failed to fetch enrollments");
// //     },
// //   });

// //   // Fetch modules when a course is selected
// //   const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery<Module[], Error>({
// //     queryKey: ["modules", selectedCourse],
// //     queryFn: async () => {
// //       if (!selectedCourse) return [];
// //       const response = await axios.get(`${API_URL}/api/module/course?courseId=${selectedCourse}`);
// //       console.log("Fetched Modules:", response.data);
// //       return response.data as Module[];
// //     },
// //     enabled: !!selectedCourse,
// //     onError: (err: any) => {
// //       toast.error(err.response?.data?.message || "Failed to fetch modules");
// //     },
// //   });

// //   // Fetch lectures when a module is selected
// //   const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useQuery<Lecture[]>({
// //     queryKey: ["lectures", selectedModule],
// //     queryFn: async () => {
// //       if (!selectedModule) return [];
// //       const response = await axios.get(`${API_URL}/api/lecture?filterModule=${selectedModule}`);
// //       console.log("Fetched Lectures:", response.data.data);
// //       return (response.data.data || []) as Lecture[];
// //     },
// //     enabled: !!selectedModule,
// //     onError: (err: any) => {
// //       toast.error(err.response?.data?.message || "Failed to fetch lectures");
// //     },
// //   });

// //   // Fetch attendance details for the student
// //   const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useQuery<Attendance[]>({
// //     queryKey: ["attendance", userId, selectedLecture],
// //     queryFn: async () => {
// //       const response = await axios.get(`${API_URL}/api/attendance/student/${userId}`);
// //       console.log("Fetched Attendance Details:", response.data);
// //       return response.data as Attendance[];
// //     },
// //     onError: (err: any) => {
// //       toast.error(err.response?.data?.message || "Failed to fetch attendance details");
// //     },
// //   });

// //   // Filter attendance records based on selected lecture or module
// //   const filteredAttendance: Attendance[] = React.useMemo(() => {
// //     const attArr = Array.isArray(attendance) ? attendance : [];
// //     let filtered = attArr;
// //     if (selectedLecture) {
// //       filtered = filtered.filter((att) => att.lecture.lectureId === parseInt(selectedLecture));
// //     } else if (selectedModule) {
// //       filtered = filtered.filter((att) => (att.lecture as any).moduleId === selectedModule);
// //     }
// //     return filtered;
// //   }, [attendance, selectedLecture, selectedModule]);

// //   // Reset dependent selections when course changes
// //   React.useEffect(() => {
// //     setSelectedModule("");
// //     setSelectedLecture("");
// //   }, [selectedCourse]);

// //   // Reset lecture selection when module changes
// //   React.useEffect(() => {
// //     setSelectedLecture("");
// //   }, [selectedModule]);

// //   // Combine loading and error states
// //   const isLoading = enrollmentsLoading || modulesLoading || lecturesLoading || attendanceLoading;
// //   const error = enrollmentsError || modulesError || lecturesError || attendanceError;

// //   return (
// //     <div className="p-6">
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Your Attendance Details</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {isLoading && <p>Loading...</p>}
// //           {error && <p className="text-red-500">Error: {String(error)}</p>}

// //           {/* Course Selection */}
// //           <div className="mb-4">
// //             <Select onValueChange={setSelectedCourse} value={selectedCourse}>
// //               <SelectTrigger className="w-[200px]">
// //                 <SelectValue placeholder="Select Course" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {(Array.isArray(enrollments) ? enrollments : []).map((enrollment) => (
// //                   <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
// //                     {enrollment.courseId || "Unnamed Course"}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>

// //           {/* Module Selection */}
// //           {selectedCourse && (
// //             <div className="mb-4">
// //               <Select onValueChange={setSelectedModule} value={selectedModule}>
// //                 <SelectTrigger className="w-[200px]">
// //                   <SelectValue placeholder="Select Module" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {(Array.isArray(modules) ? modules : []).map((module) => (
// //                     <SelectItem key={module.moduleId} value={module.moduleId}>
// //                       {module.name}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           )}

// //           {/* Lecture Selection */}
// //           {selectedModule && (
// //             <div className="mb-4">
// //               <Select onValueChange={setSelectedLecture} value={selectedLecture}>
// //                 <SelectTrigger className="w-[200px]">
// //                   <SelectValue placeholder="Select Lecture" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {(Array.isArray(lectures) ? lectures : []).map((lecture) => (
// //                     <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
// //                       {lecture.name || "Lecture"} - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           )}

// //           {/* Attendance Table */}
// //           {isLoading ? (
// //             <p>Loading attendance records...</p>
// //           ) : !selectedCourse ? (
// //             <p>Please select a course to view your attendance.</p>
// //           ) : filteredAttendance.length === 0 ? (
// //             <p>No attendance records found for the selected filters.</p>
// //           ) : (
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableHead>Lecture ID</TableHead>
// //                   <TableHead>Module</TableHead>
// //                   <TableHead>Venue</TableHead>
// //                   <TableHead>Lecture Time</TableHead>
// //                   <TableHead>Status</TableHead>
// //                   <TableHead>Marked At</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {filteredAttendance.map((att) => (
// //                   <TableRow key={att.attendanceId}>
// //                     <TableCell>{att.lecture.lectureId}</TableCell>
// //                     <TableCell>{att.lecture.module?.name || "Unnamed Module"}</TableCell>
// //                     <TableCell>{att.lecture.venue}</TableCell>
// //                     <TableCell>{new Date(att.lecture.time).toLocaleString()}</TableCell>
// //                     <TableCell>{att.attended ? "Present" : "Absent"}</TableCell>
// //                     <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default StudentAttendance;

// import * as React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import toast from "react-hot-toast";

// const API_URL = "http://localhost:8080";

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

// interface Attendance {
//   attendanceId: number;
//   lecture: {
//     lectureId: number;
//     module: { name: string };
//     venue: string;
//     time: string;
//   };
//   attended: boolean;
//   markedAt: string;
// }

// interface StudentAttendanceProps {
//   userId: string;
// }

// const StudentAttendance: React.FC<StudentAttendanceProps> = ({ userId }) => {
//   const [selectedCourse, setSelectedCourse] = React.useState<string>("");
//   const [selectedModule, setSelectedModule] = React.useState<string>("");
//   const [selectedLecture, setSelectedLecture] = React.useState<string>("");

//   const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery<Enrollment[], Error>({
//     queryKey: ["enrollments", userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/enroll/student/${userId}`);
//       return response.data;
//     },
//     onError: (err: any) => toast.error(err.response?.data?.message || "Failed to fetch enrollments"),
//   });

//   const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery<Module[], Error>({
//     queryKey: ["modules", selectedCourse],
//     queryFn: async () => {
//       if (!selectedCourse) return [];
//       const response = await axios.get(`${API_URL}/api/module/course?courseId=${selectedCourse}`);
//       return response.data;
//     },
//     enabled: !!selectedCourse,
//     onError: (err: any) => toast.error(err.response?.data?.message || "Failed to fetch modules"),
//   });

//   const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useQuery<Lecture[]>({
//     queryKey: ["lectures", selectedModule],
//     queryFn: async () => {
//       if (!selectedModule) return [];
//       const response = await axios.get(`${API_URL}/api/lecture?filterModule=${selectedModule}`);
//       return (response.data.data || []) as Lecture[];
//     },
//     enabled: !!selectedModule,
//     onError: (err: any) => toast.error(err.response?.data?.message || "Failed to fetch lectures"),
//   });

//   const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useQuery<Attendance[]>({
//     queryKey: ["attendance", userId, selectedLecture],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/attendance/student/${userId}`);
//       return response.data;
//     },
//     onError: (err: any) => toast.error(err.response?.data?.message || "Failed to fetch attendance"),
//   });

//   const filteredAttendance: Attendance[] = React.useMemo(() => {
//     const attArr = Array.isArray(attendance) ? attendance : [];
//     if (selectedLecture) {
//       return attArr.filter((att) => att.lecture.lectureId === parseInt(selectedLecture));
//     } else if (selectedModule) {
//       return attArr.filter((att) => (att.lecture as any).moduleId === selectedModule);
//     }
//     return attArr;
//   }, [attendance, selectedLecture, selectedModule]);

//   React.useEffect(() => {
//     setSelectedModule("");
//     setSelectedLecture("");
//   }, [selectedCourse]);

//   React.useEffect(() => {
//     setSelectedLecture("");
//   }, [selectedModule]);

//   const isLoading = enrollmentsLoading || modulesLoading || lecturesLoading || attendanceLoading;
//   const error = enrollmentsError || modulesError || lecturesError || attendanceError;

//   return (
//     <div className="p-6 bg-[#F3F4F6] min-h-screen">
//       <Card className="bg-white border border-gray-200 shadow-md">
//         <CardHeader>
//           <CardTitle className="text-[#1E3A8A] text-2xl font-bold">Your Attendance Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading && <p className="text-[#1E3A8A]">Loading...</p>}
//           {error && <p className="text-red-500">Error: {String(error)}</p>}

//           {/* Course Selection */}
//           <div className="mb-4">
//             <label className="text-[#1E3A8A] font-medium block mb-1">Course</label>
//             <Select onValueChange={setSelectedCourse} value={selectedCourse}>
//               <SelectTrigger className="w-[250px] bg-[#F3F4F6] border-[#1E3A8A] text-[#1E3A8A]">
//                 <SelectValue placeholder="Select Course" />
//               </SelectTrigger>
//               <SelectContent>
//                 {(Array.isArray(enrollments) ? enrollments : []).map((enrollment) => (
//                   <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
//                     {enrollment.courseId || "Unnamed Course"}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Module Selection */}
//           {selectedCourse && (
//             <div className="mb-4">
//               <label className="text-[#1E3A8A] font-medium block mb-1">Module</label>
//               <Select onValueChange={setSelectedModule} value={selectedModule}>
//                 <SelectTrigger className="w-[250px] bg-[#F3F4F6] border-[#1E3A8A] text-[#1E3A8A]">
//                   <SelectValue placeholder="Select Module" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {(Array.isArray(modules) ? modules : []).map((module) => (
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
//             <div className="mb-6">
//               <label className="text-[#1E3A8A] font-medium block mb-1">Lecture</label>
//               <Select onValueChange={setSelectedLecture} value={selectedLecture}>
//                 <SelectTrigger className="w-[250px] bg-[#F3F4F6] border-[#1E3A8A] text-[#1E3A8A]">
//                   <SelectValue placeholder="Select Lecture" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {(Array.isArray(lectures) ? lectures : []).map((lecture) => (
//                     <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
//                       {lecture.module?.name || "Lecture"} - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Attendance Table */}
//           {isLoading ? (
//             <p className="text-[#1E3A8A]">Loading attendance records...</p>
//           ) : !selectedCourse ? (
//             <p className="text-[#1E3A8A]">Please select a course to view your attendance.</p>
//           ) : filteredAttendance.length === 0 ? (
//             <p className="text-[#1E3A8A]">No attendance records found for the selected filters.</p>
//           ) : (
//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <Table>
//                 <TableHeader className="bg-[#1E3A8A] text-white">
//                   <TableRow>
//                     <TableHead className="text-white">Lecture ID</TableHead>
//                     <TableHead className="text-white">Module</TableHead>
//                     <TableHead className="text-white">Venue</TableHead>
//                     <TableHead className="text-white">Lecture Time</TableHead>
//                     <TableHead className="text-white">Status</TableHead>
//                     <TableHead className="text-white">Marked At</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredAttendance.map((att) => (
//                     <TableRow key={att.attendanceId} className="hover:bg-gray-100">
//                       <TableCell>{att.lecture.lectureId}</TableCell>
//                       <TableCell>{att.lecture.module?.name || "Unnamed Module"}</TableCell>
//                       <TableCell>{att.lecture.venue}</TableCell>
//                       <TableCell>{new Date(att.lecture.time).toLocaleString()}</TableCell>
//                       <TableCell className={att.attended ? "text-green-600" : "text-red-600"}>
//                         {att.attended ? "Present" : "Absent"}
//                       </TableCell>
//                       <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
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
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [selectedModule, setSelectedModule] = React.useState<string>("");
  const [selectedLecture, setSelectedLecture] = React.useState<string>("");

  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery<Enrollment[], Error>({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/enroll/student/${userId}`);
      return response.data as Enrollment[];
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch enrollments");
    },
  });

  const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery<Module[], Error>({
    queryKey: ["modules", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const response = await axios.get(`${API_URL}/api/module/course?courseId=${selectedCourse}`);
      return response.data as Module[];
    },
    enabled: !!selectedCourse,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch modules");
    },
  });

  const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useQuery<Lecture[]>({
    queryKey: ["lectures", selectedModule],
    queryFn: async () => {
      if (!selectedModule) return [];
      const response = await axios.get(`${API_URL}/api/lecture?filterModule=${selectedModule}`);
      return (response.data.data || []) as Lecture[];
    },
    enabled: !!selectedModule,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch lectures");
    },
  });

  const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useQuery<Attendance[]>({
    queryKey: ["attendance", userId, selectedLecture],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/attendance/student/${userId}`);
      return response.data as Attendance[];
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to fetch attendance details");
    },
  });

  const filteredAttendance: Attendance[] = React.useMemo(() => {
    const attArr = Array.isArray(attendance) ? attendance : [];
    let filtered = attArr;
    if (selectedLecture) {
      filtered = filtered.filter((att) => att.lecture.lectureId === parseInt(selectedLecture));
    } else if (selectedModule) {
      filtered = filtered.filter((att) => (att.lecture as any).moduleId === selectedModule);
    }
    return filtered;
  }, [attendance, selectedLecture, selectedModule]);

  React.useEffect(() => {
    setSelectedModule("");
    setSelectedLecture("");
  }, [selectedCourse]);

  React.useEffect(() => {
    setSelectedLecture("");
  }, [selectedModule]);

  const isLoading = enrollmentsLoading || modulesLoading || lecturesLoading || attendanceLoading;
  const error = enrollmentsError || modulesError || lecturesError || attendanceError;

  return (
    <div className="p-6">
      <Card className="bg-white shadow-md border border-gray-200 dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="bg-blue-800 text-white rounded-t-md px-4 py-3">
          <CardTitle className="text-lg font-semibold">Your Attendance Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {isLoading && <p className="text-blue-700">Loading...</p>}
          {error && <p className="text-red-500">Error: {String(error)}</p>}

          {/* Horizontal Selectors */}
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            {/* Course */}
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger className="w-[200px] border-blue-700">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(enrollments) ? enrollments : []).map((enrollment) => (
                  <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
                    {enrollment.courseId || "Unnamed Course"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Module */}
            <Select onValueChange={setSelectedModule} value={selectedModule} disabled={!selectedCourse}>
              <SelectTrigger className="w-[200px] border-blue-700">
                <SelectValue placeholder="Select Module" />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(modules) ? modules : []).map((module) => (
                  <SelectItem key={module.moduleId} value={module.moduleId}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Lecture */}
            <Select onValueChange={setSelectedLecture} value={selectedLecture} disabled={!selectedModule}>
              <SelectTrigger className="w-[240px] border-blue-700">
                <SelectValue placeholder="Select Lecture" />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(lectures) ? lectures : []).map((lecture) => (
                  <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
                    Lecture - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attendance Table */}
          {isLoading ? (
            <p>Loading attendance records...</p>
          ) : !selectedCourse ? (
            <p className="text-gray-700">Please select a course to view your attendance.</p>
          ) : filteredAttendance.length === 0 ? (
            <p className="text-gray-500">No attendance records found for the selected filters.</p>
          ) : (
            <Table className="border mt-4 text-sm">
              <TableHeader className="bg-blue-50 dark:bg-slate-800">
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
                    <TableCell className={att.attended ? "text-green-600" : "text-red-600"}>
                      {att.attended ? "Present" : "Absent"}
                    </TableCell>
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
