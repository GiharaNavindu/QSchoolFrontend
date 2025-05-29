

// import * as React from 'react';
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Controller, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import toast from 'react-hot-toast';
// import { z } from 'zod';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import dayjs from 'dayjs';
// import type { Dayjs } from 'dayjs';
// import { Lecture, Module, Student, Attendance } from '../types';

// interface LecturerAttendanceProps {
//   userId: string;
// }

// const API_URL = 'http://localhost:8080';

// // Schema for creating a lecture
// const lectureSchema = z.object({
//   venue: z.string().max(100, 'Venue must be at most 100 characters').optional(),
//   time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:MM format'),
//   moduleId: z.string().min(1, 'Module is required'),
// });

// // Schema for updating attendance
// const attendanceSchema = z.object({
//   attended: z.boolean(),
//   markedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Marked at must be in YYYY-MM-DDTHH:MM format'),
// });

// // Schema for adding new attendance
// const newAttendanceSchema = z.object({
//   studentId: z.string().min(1, 'Student is required'),
//   attended: z.boolean(),
// });

// const LecturerAttendance: React.FC<LecturerAttendanceProps> = ({ userId }) => {
//   const [lectureId, setLectureId] = useState<string>('');
//   const [editAttendance, setEditAttendance] = useState<Attendance | null>(null);
//   const queryClient = useQueryClient();

//   // Form for creating a lecture
//   const lectureForm = useForm({
//     resolver: zodResolver(lectureSchema),
//     defaultValues: {
//       venue: '',
//       time: '',
//       moduleId: '',
//     },
//   });

//   // Form for updating attendance
//   const attendanceForm = useForm({
//     resolver: zodResolver(attendanceSchema),
//     defaultValues: {
//       attended: false,
//       markedAt: dayjs().format('YYYY-MM-DDTHH:mm'),
//     },
//   });

//   // Form for adding new attendance
//   const newAttendanceForm = useForm({
//     resolver: zodResolver(newAttendanceSchema),
//     defaultValues: {
//       studentId: '',
//       attended: true,
//     },
//   });

//   // Fetch modules
//   const { data: modules, isLoading: modulesLoading } = useQuery({
//     queryKey: ['modules'],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/module`);
//       return response.data.data;
//     },
//   });

//   // Fetch lectures
//   const { data: lectures, isLoading: lecturesLoading } = useQuery({
//     queryKey: ['lectures', userId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/lecture`);
//       return response.data.data.filter((lecture: Lecture) => lecture.lecturerId === userId);
//     },
//   });
  

//   // Fetch attendance for selected lecture
//   const { data: attendance, isLoading: attendanceLoading } = useQuery({
//     queryKey: ['attendance', lectureId],
//     queryFn: async () => {
//       if (!lectureId) return [];
//       const response = await axios.get(`${API_URL}/api/attendance/lecture/${lectureId}`);
//       return response.data;
//     },
//     enabled: !!lectureId,
//   });

//   // Fetch students enrolled in the lecture's module
//   const { data: enrolledStudents, isLoading: studentsLoading } = useQuery({
//     queryKey: ['students', lectureId],
//     queryFn: async () => {
//       if (!lectureId) return [];
//       const lectureResponse = await axios.get(`${API_URL}/api/lecture/${lectureId}`);
//       const moduleId = lectureResponse.data.moduleId;
//       const response = await axios.get(`${API_URL}/api/student/module/${moduleId}`);
//       return response.data;
//     },
//     enabled: !!lectureId,
//   });

//   // Create lecture mutation
//   const createLectureMutation = useMutation({
//     mutationFn: (data: { venue?: string; time: string; moduleId: string }) =>
//       axios.post(`${API_URL}/api/lecture`, {
//         venue: data.venue,
//         time: `${data.time}:00Z`,
//         lecturerId: userId,
//         moduleId: data.moduleId,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['lectures', userId] });
//       lectureForm.reset();
//       toast.success('Lecture created successfully');
//     },
//     onError: (error: any) => {
//       const message = error.response?.data?.message || error.response?.data?.error || 'Failed to create lecture';
//       toast.error(message);
//     },
//   });

//   // Mark attendance mutation
//   const markAttendanceMutation = useMutation({
//     mutationFn: (data: { student: Student; lecture: Lecture; attended: boolean }) =>
//       axios.post(`${API_URL}/api/attendance/mark`, {
//         student: data.student,
//         lecture: data.lecture,
//         attended: data.attended,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
//       toast.success('Attendance recorded successfully');
//     },
//     onError: (error: any) => {
//       const message = error.response?.data?.message || error.response?.data?.error || 'Failed to mark attendance';
//       toast.error(message);
//     },
//   });

//   // Update attendance mutation
//   const updateAttendanceMutation = useMutation({
//     mutationFn: (data: { attendanceId: number; attended: boolean; markedAt: string }) =>
//       axios.put(`${API_URL}/api/attendance/${data.attendanceId}`, {
//         attended: data.attended,
//         markedAt: `${data.markedAt}:00Z`,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
//       setEditAttendance(null);
//       attendanceForm.reset();
//       toast.success('Attendance updated successfully');
//     },
//     onError: (error: any) => {
//       const message = error.response?.data?.message || error.response?.data?.error || 'Failed to update attendance';
//       toast.error(message);
//     },
//   });

//   // Delete attendance mutation
//   const deleteAttendanceMutation = useMutation({
//     mutationFn: (attendanceId: number) => axios.delete(`${API_URL}/api/attendance/${attendanceId}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
//       toast.success('Attendance deleted successfully');
//     },
//     onError: (error: any) => {
//       const message = error.response?.data?.message || error.response?.data?.error || 'Failed to delete attendance';
//       toast.error(message);
//     },
//   });

//   // Handle lecture creation
//   const onCreateLecture = (data: { venue?: string; time: string; moduleId: string }) => {
//     createLectureMutation.mutate(data);
//   };

//   // Handle marking new attendance
//   const onMarkNewAttendance = (data: { studentId: string; attended: boolean }) => {
//     const selectedLecture = lectures?.find((lecture: Lecture) => lecture.lectureId === parseInt(lectureId));
//     const selectedStudent = enrolledStudents?.find((student: Student) => student.studentId === data.studentId);
//     if (!selectedLecture || !selectedStudent) {
//       toast.error('Lecture or student not found');
//       return;
//     }
//     markAttendanceMutation.mutate({
//       student: selectedStudent,
//       lecture: selectedLecture,
//       attended: data.attended,
//     });
//     newAttendanceForm.reset();
//   };

//   // Handle updating attendance
//   const onUpdateAttendance = (data: { attended: boolean; markedAt: string }) => {
//     if (!editAttendance) return;
//     updateAttendanceMutation.mutate({
//       attendanceId: editAttendance.attendanceId,
//       attended: data.attended,
//       markedAt: data.markedAt,
//     });
//   };

//   // Handle deleting attendance
//   const handleDeleteAttendance = (attendanceId: number) => {
//     deleteAttendanceMutation.mutate(attendanceId);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Manage Attendance</h1>

//       {/* Lecture Creation Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Create New Lecture</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={lectureForm.handleSubmit(onCreateLecture)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Controller
//                 name="venue"
//                 control={lectureForm.control}
//                 render={({ field }) => (
//                   <div>
//                     <Input {...field} placeholder="Venue (e.g., Room 101)" />
//                     {lectureForm.formState.errors.venue && (
//                       <p className="text-red-500 text-sm">{lectureForm.formState.errors.venue.message}</p>
//                     )}
//                   </div>
//                 )}
//               />
//             </div>
//             <div>
//               <Controller
//                 name="time"
//                 control={lectureForm.control}
//                 render={({ field }) => (
//                   <div>
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                       <DateTimePicker
//                         label="Select Date and Time"
//                         value={field.value ? dayjs(field.value) : null}
//                         onChange={(newValue: Dayjs | null) => {
//                           field.onChange(newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '');
//                         }}
//                         slotProps={{
//                           textField: {
//                             fullWidth: true,
//                             error: !!lectureForm.formState.errors.time,
//                             helperText: lectureForm.formState.errors.time?.message,
//                           },
//                         }}
//                         minutesStep={1}
//                       />
//                     </LocalizationProvider>
//                   </div>
//                 )}
//               />
//             </div>
//             <div>
//               <Controller
//                 name="moduleId"
//                 control={lectureForm.control}
//                 render={({ field }) => (
//                   <div>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Module" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {modules?.map((module: Module) => (
//                           <SelectItem key={module.moduleId} value={module.moduleId}>
//                             {module.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {lectureForm.formState.errors.moduleId && (
//                       <p className="text-red-500 text-sm">{lectureForm.formState.errors.moduleId.message}</p>
//                     )}
//                   </div>
//                 )}
//               />
//             </div>
//             <Button type="submit" disabled={createLectureMutation.isPending}>
//               {createLectureMutation.isPending ? 'Creating...' : 'Create Lecture'}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Lecture Selection */}
//       <Select value={lectureId} onValueChange={setLectureId}>
//         <SelectTrigger className="w-[300px] mb-4">
//           <SelectValue placeholder="Select Lecture" />
//         </SelectTrigger>
//         <SelectContent>
//           {lectures?.map((lecture: Lecture) => (
//             <SelectItem key={lecture.lectureId} value={lecture.lectureId.toString()}>
//               {lecture.moduleId} - {new Date(lecture.time).toLocaleString()}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Add New Attendance Form */}
//       {lectureId && (
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Add Attendance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={newAttendanceForm.handleSubmit(onMarkNewAttendance)}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4"
//             >
//               <div>
//                 <Controller
//                   name="studentId"
//                   control={newAttendanceForm.control}
//                   render={({ field }) => (
//                     <div>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Student" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {enrolledStudents?.map((student: Student) => (
//                             <SelectItem key={student.studentId} value={student.studentId}>
//                               {student.firstName} {student.lastName} ({student.studentId})
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {newAttendanceForm.formState.errors.studentId && (
//                         <p className="text-red-500 text-sm">{newAttendanceForm.formState.errors.studentId.message}</p>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//               <div>
//                 <Controller
//                   name="attended"
//                   control={newAttendanceForm.control}
//                   render={({ field }) => (
//                     <div>
//                       <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value.toString()}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="true">Present</SelectItem>
//                           <SelectItem value="false">Absent</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   )}
//                 />
//               </div>
//               <Button type="submit" disabled={markAttendanceMutation.isPending}>
//                 {markAttendanceMutation.isPending ? 'Marking...' : 'Mark Attendance'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {/* Attendance Table */}
//       {lecturesLoading || attendanceLoading || modulesLoading || studentsLoading ? (
//         <p>Loading...</p>
//       ) : !lectureId ? (
//         <p>Please select a lecture to manage attendance.</p>
//       ) : attendance?.length === 0 ? (
//         <p>No attendance records found for this lecture. Add a new record above.</p>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Student ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Marked At</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {attendance?.map((att: Attendance) => (
//               <TableRow key={att.attendanceId}>
//                 <TableCell>{att.student.studentId}</TableCell>
//                 <TableCell>{att.student.firstName} {att.student.lastName}</TableCell>
//                 <TableCell>{att.attended ? 'Present' : 'Absent'}</TableCell>
//                 <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
//                 <TableCell className="flex gap-2">
//                   <Dialog
//                     open={editAttendance?.attendanceId === att.attendanceId}
//                     onOpenChange={(open) => {
//                       if (open) {
//                         setEditAttendance(att);
//                         attendanceForm.reset({
//                           attended: att.attended,
//                           markedAt: att.markedAt ? dayjs(att.markedAt).format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm'),
//                         });
//                       } else {
//                         setEditAttendance(null);
//                       }
//                     }}
//                   >
//                     <DialogTrigger asChild>
//                       <Button variant="outline">Edit</Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Edit Attendance</DialogTitle>
//                       </DialogHeader>
//                       <form
//                         onSubmit={attendanceForm.handleSubmit(onUpdateAttendance)}
//                         className="grid gap-4"
//                       >
//                         <div>
//                           <Label>Status</Label>
//                           <Controller
//                             name="attended"
//                             control={attendanceForm.control}
//                             render={({ field }) => (
//                               <Select
//                                 onValueChange={(value) => field.onChange(value === 'true')}
//                                 value={field.value.toString()}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="true">Present</SelectItem>
//                                   <SelectItem value="false">Absent</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             )}
//                           />
//                         </div>
//                         <div>
//                           <Label>Marked At</Label>
//                           <Controller
//                             name="markedAt"
//                             control={attendanceForm.control}
//                             render={({ field }) => (
//                               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DateTimePicker
//                                   label="Select Date and Time"
//                                   value={field.value ? dayjs(field.value) : null}
//                                   onChange={(newValue: Dayjs | null) => {
//                                     field.onChange(newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '');
//                                   }}
//                                   slotProps={{
//                                     textField: {
//                                       fullWidth: true,
//                                       error: !!attendanceForm.formState.errors.markedAt,
//                                       helperText: attendanceForm.formState.errors.markedAt?.message,
//                                     },
//                                   }}
//                                   minutesStep={1}
//                                 />
//                               </LocalizationProvider>
//                             )}
//                           />
//                         </div>
//                         <Button type="submit" disabled={updateAttendanceMutation.isPending}>
//                           {updateAttendanceMutation.isPending ? 'Updating...' : 'Update Attendance'}
//                         </Button>
//                       </form>
//                     </DialogContent>
//                   </Dialog>
//                   <Button
//                     variant="destructive"
//                     onClick={() => handleDeleteAttendance(att.attendanceId)}
//                     disabled={deleteAttendanceMutation.isPending}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default LecturerAttendance;


import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Lecture, Module, Student, Attendance } from '../types';

interface LecturerAttendanceProps {
  userId: string;
}

const API_URL = 'http://localhost:8080';

// Schema definitions (unchanged)
const lectureSchema = z.object({
  venue: z.string().max(100, 'Venue must be at most 100 characters').optional(),
  time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:MM format'),
  moduleId: z.string().min(1, 'Module is required'),
});

const attendanceSchema = z.object({
  attended: z.boolean(),
  markedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Marked at must be in YYYY-MM-DDTHH:MM format'),
});

const newAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  attended: z.boolean(),
});

const multiAttendanceSchema = z.object({
  students: z.array(
    z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      attended: z.boolean(),
    })
  ).min(1, 'At least one student must be selected'),
});

const LecturerAttendance: React.FC<LecturerAttendanceProps> = ({ userId = 'LEC001' }) => { // Fallback to LEC001 for testing
  // Log userId and validate
  useEffect(() => {
    console.log('LecturerAttendance mounted with userId:', userId);
    if (!userId || userId === ':userId') {
      console.warn('Invalid userId detected. Using fallback ID "LEC001".');
      toast.error('Invalid lecturer ID provided. Please log in with a valid account.');
    }
  }, [userId]);

  const [lectureId, setLectureId] = useState<string>('');
  const [editAttendance, setEditAttendance] = useState<Attendance | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<{ studentId: string; attended: boolean }[]>([]);
  const queryClient = useQueryClient();

  // Forms (unchanged)
  const lectureForm = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: { venue: '', time: '', moduleId: '' },
  });

  const attendanceForm = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { attended: false, markedAt: dayjs().format('YYYY-MM-DDTHH:mm') },
  });

  const newAttendanceForm = useForm({
    resolver: zodResolver(newAttendanceSchema),
    defaultValues: { studentId: '', attended: true },
  });

  const multiAttendanceForm = useForm({
    resolver: zodResolver(multiAttendanceSchema),
    defaultValues: { students: [] },
  });

  // Fetch modules
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      console.log('Fetching modules');
      const response = await axios.get(`${API_URL}/api/module`);
      console.log('Modules fetched:', response.data.data);
      return response.data.data;
    },
  });

  // Fetch lectures
  const { data: lectures, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', userId],
    queryFn: async () => {
      console.log('Fetching lectures for userId:', userId);
      const response = await axios.get(`${API_URL}/api/lecture`);
      console.log('All lectures from API:', response.data.data);
      const filteredLectures = response.data.data.filter((lecture: Lecture) => lecture.lecturerId === userId);
      console.log('Filtered lectures for userId', userId, ':', filteredLectures);
      return filteredLectures;
    },
  });

  // Fetch attendance for selected lecture
  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', lectureId],
    queryFn: async () => {
      if (!lectureId) return [];
      console.log('Fetching attendance for lectureId:', lectureId);
      const response = await axios.get(`${API_URL}/api/attendance/lecture/${lectureId}/details`);
      console.log('Attendance data:', response.data);
      return response.data;
    },
    enabled: !!lectureId,
  });

  // Fetch enrolled students for the lecture's module
  const { data: enrolledStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', lectureId],
    queryFn: async () => {
      if (!lectureId) return [];
      console.log('Fetching enrolled students for lectureId:', lectureId);
      const response = await axios.get(`${API_URL}/api/attendance/lecture/${lectureId}/students`);
      console.log('Enrolled students:', response.data);
      return response.data;
    },
    enabled: !!lectureId,
  });

  // Create lecture mutation
  const createLectureMutation = useMutation({
    mutationFn: (data: { venue?: string; time: string; moduleId: string }) => {
      const payload = {
        venue: data.venue,
        time: `${data.time}:00Z`,
        lecturerId: userId,
        moduleId: data.moduleId,
      };
      console.log('Creating lecture with payload:', payload);
      return axios.post(`${API_URL}/api/lecture`, payload);
    },
    onSuccess: (response) => {
      console.log('Lecture created successfully:', response.data);
      queryClient.invalidateQueries({ queryKey: ['lectures', userId] });
      lectureForm.reset();
      toast.success('Lecture created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating lecture:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create lecture');
    },
  });

  // Mark single attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: (data: { student: Student; lecture: Lecture; attended: boolean }) =>
      axios.post(`${API_URL}/api/attendance/mark`, {
        student: { studentId: data.student.studentId },
        lecture: { lectureId: data.lecture.lectureId },
        attended: data.attended,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
      toast.success('Attendance recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to mark attendance');
    },
  });

  // Mark multiple attendances mutation
  const markMultipleAttendancesMutation = useMutation({
    mutationFn: (data: { students: { studentId: string; attended: boolean }[] }) =>
      axios.post(`${API_URL}/api/attendance/lecture/${lectureId}/mark-multiple`, data.students.map(s => ({
        student: { studentId: s.studentId },
        lecture: { lectureId: parseInt(lectureId) },
        attended: s.attended,
      }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
      multiAttendanceForm.reset();
      toast.success('Multiple attendances recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to mark multiple attendances');
    },
  });

  // Update attendance mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: (data: { attendanceId: number; attended: boolean; markedAt: string }) =>
      axios.put(`${API_URL}/api/attendance/${data.attendanceId}`, {
        attended: data.attended,
        markedAt: `${data.markedAt}:00Z`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
      setEditAttendance(null);
      attendanceForm.reset();
      toast.success('Attendance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update attendance');
    },
  });

  // Delete attendance mutation
  const deleteAttendanceMutation = useMutation({
    mutationFn: (attendanceId: number) => axios.delete(`${API_URL}/api/attendance/${attendanceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
      toast.success('Attendance deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete attendance');
    },
  });

  // Handlers
  const onCreateLecture = (data: { venue?: string; time: string; moduleId: string }) => {
    console.log('Submitting lecture creation with userId:', userId);
    createLectureMutation.mutate(data);
  };

  const onMarkNewAttendance = (data: { studentId: string; attended: boolean }) => {
    const selectedLecture = lectures?.find((lecture: Lecture) => lecture.lectureId === parseInt(lectureId));
    const selectedStudent = enrolledStudents?.find((student: Student) => student.studentId === data.studentId);
    if (!selectedLecture || !selectedStudent) {
      toast.error('Lecture or student not found');
      return;
    }
    markAttendanceMutation.mutate({
      student: selectedStudent,
      lecture: selectedLecture,
      attended: data.attended,
    });
    newAttendanceForm.reset();
  };

  const onMarkMultipleAttendances = (data: { students: { studentId: string; attended: boolean }[] }) => {
    if (!lectureId) {
      toast.error('Please select a lecture');
      return;
    }
    markMultipleAttendancesMutation.mutate(data);
  };

  const onUpdateAttendance = (data: { attended: boolean; markedAt: string }) => {
    if (!editAttendance) return;
    updateAttendanceMutation.mutate({
      attendanceId: editAttendance.attendanceId,
      attended: data.attended,
      markedAt: data.markedAt,
    });
  };

  const handleDeleteAttendance = (attendanceId: number) => {
    deleteAttendanceMutation.mutate(attendanceId);
  };

  const handleStudentToggle = (student: Student, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, { studentId: student.studentId, attended: true }]);
    } else {
      setSelectedStudents(selectedStudents.filter(s => s.studentId !== student.studentId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Attendance</h1>
      <p className="mb-4">Logged in as Lecturer ID: {userId}</p>

      {/* Lecture Creation Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={lectureForm.handleSubmit(onCreateLecture)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Controller
                name="venue"
                control={lectureForm.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Venue (e.g., Room 101)" />
                    {lectureForm.formState.errors.venue && (
                      <p className="text-red-500 text-sm">{lectureForm.formState.errors.venue.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <Controller
                name="time"
                control={lectureForm.control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Select Date and Time"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue: Dayjs | null) => {
                        field.onChange(newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!lectureForm.formState.errors.time,
                          helperText: lectureForm.formState.errors.time?.message,
                        },
                      }}
                      minutesStep={1}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div>
              <Controller
                name="moduleId"
                control={lectureForm.control}
                render={({ field }) => (
                  <div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules?.map((module: Module) => (
                          <SelectItem key={module.moduleId} value={module.moduleId}>
                            {module.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {lectureForm.formState.errors.moduleId && (
                      <p className="text-red-500 text-sm">{lectureForm.formState.errors.moduleId.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <Button type="submit" disabled={createLectureMutation.isPending || userId === ':userId'}>
              {createLectureMutation.isPending ? 'Creating...' : 'Create Lecture'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lecture Selection */}
      <Select value={lectureId} onValueChange={setLectureId}>
        <SelectTrigger className="w-[300px] mb-4">
          <SelectValue placeholder="Select Lecture" />
        </SelectTrigger>
        <SelectContent>
          {lectures?.map((lecture: Lecture) => (
            <SelectItem key={lecture.lectureId} value={lecture.lectureId.toString()}>
              {lecture.moduleId} - {new Date(lecture.time).toLocaleString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mark Multiple Attendances Form */}
      {lectureId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mark Attendance for Multiple Students</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={multiAttendanceForm.handleSubmit(onMarkMultipleAttendances)}
              className="grid gap-4"
            >
              <div>
                <Label>Select Students</Label>
                <div className="max-h-64 overflow-y-auto border p-2 rounded">
                  {enrolledStudents?.map((student: Student) => (
                    <div key={student.studentId} className="flex items-center gap-2 mb-2">
                      <Checkbox
                        id={student.studentId}
                        checked={selectedStudents.some(s => s.studentId === student.studentId)}
                        onCheckedChange={(checked) => handleStudentToggle(student, checked as boolean)}
                      />
                      <label htmlFor={student.studentId}>
                        {student.firstName} {student.lastName} ({student.studentId})
                      </label>
                      {selectedStudents.some(s => s.studentId === student.studentId) && (
                        <Select
                          value={selectedStudents.find(s => s.studentId === student.studentId)?.attended.toString()}
                          onValueChange={(value) => {
                            setSelectedStudents(
                              selectedStudents.map(s =>
                                s.studentId === student.studentId ? { ...s, attended: value === 'true' } : s
                              )
                            );
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Present</SelectItem>
                            <SelectItem value="false">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
                {multiAttendanceForm.formState.errors.students && (
                  <p className="text-red-500 text-sm">{multiAttendanceForm.formState.errors.students.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={markMultipleAttendancesMutation.isPending || selectedStudents.length === 0}
                onClick={() => multiAttendanceForm.setValue('students', selectedStudents)}
              >
                {markMultipleAttendancesMutation.isPending ? 'Marking...' : 'Mark Multiple Attendances'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Single Attendance Form */}
      {lectureId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Single Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={newAttendanceForm.handleSubmit(onMarkNewAttendance)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <Controller
                  name="studentId"
                  control={newAttendanceForm.control}
                  render={({ field }) => (
                    <div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Student" />
                        </SelectTrigger>
                        <SelectContent>
                          {enrolledStudents?.map((student: Student) => (
                            <SelectItem key={student.studentId} value={student.studentId}>
                              {student.firstName} {student.lastName} ({student.studentId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newAttendanceForm.formState.errors.studentId && (
                        <p className="text-red-500 text-sm">{newAttendanceForm.formState.errors.studentId.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="attended"
                  control={newAttendanceForm.control}
                  render={({ field }) => (
                    <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Present</SelectItem>
                        <SelectItem value="false">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" disabled={markAttendanceMutation.isPending}>
                {markAttendanceMutation.isPending ? 'Marking...' : 'Mark Attendance'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      {lecturesLoading || attendanceLoading || modulesLoading || studentsLoading ? (
        <p>Loading...</p>
      ) : !lectureId ? (
        <p>Please select a lecture to manage attendance.</p>
      ) : attendance?.length === 0 ? (
        <p>No attendance records found for this lecture. Add a new record above.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Marked At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance?.map((att: Attendance) => (
              <TableRow key={att.attendanceId}>
                <TableCell>{att.student.studentId}</TableCell>
                <TableCell>{att.student.firstName} {att.student.lastName}</TableCell>
                <TableCell>{att.attended ? 'Present' : 'Absent'}</TableCell>
                <TableCell>{new Date(att.markedAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog
                    open={editAttendance?.attendanceId === att.attendanceId}
                    onOpenChange={(open) => {
                      if (open) {
                        setEditAttendance(att);
                        attendanceForm.reset({
                          attended: att.attended,
                          markedAt: att.markedAt ? dayjs(att.markedAt).format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm'),
                        });
                      } else {
                        setEditAttendance(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Attendance</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={attendanceForm.handleSubmit(onUpdateAttendance)}
                        className="grid gap-4"
                      >
                        <div>
                          <Label>Status</Label>
                          <Controller
                            name="attended"
                            control={attendanceForm.control}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => field.onChange(value === 'true')}
                                value={field.value.toString()}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Present</SelectItem>
                                  <SelectItem value="false">Absent</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                          <Label>Marked At</Label>
                          <Controller
                            name="markedAt"
                            control={attendanceForm.control}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  label="Select Date and Time"
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(newValue: Dayjs | null) => {
                                    field.onChange(newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '');
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      error: !!attendanceForm.formState.errors.markedAt,
                                      helperText: attendanceForm.formState.errors.markedAt?.message,
                                    },
                                  }}
                                  minutesStep={1}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </div>
                        <Button type="submit" disabled={updateAttendanceMutation.isPending}>
                          {updateAttendanceMutation.isPending ? 'Updating...' : 'Update Attendance'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAttendance(att.attendanceId)}
                    disabled={deleteAttendanceMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LecturerAttendance;