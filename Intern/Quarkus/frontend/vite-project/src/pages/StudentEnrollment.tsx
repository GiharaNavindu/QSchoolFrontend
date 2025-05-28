// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import axios from "axios";
// // import * as React from "react";
// // import { useState } from "react";
// // import { Controller, useForm } from "react-hook-form";
// // import toast from "react-hot-toast";
// // import { z } from "zod";
// // import { Course, Enrolls } from "../types";

// // interface StudentEnrollmentsProps {
// //   userId: string;
// // }

// // const enrollSchema = z.object({
// //   courseId: z
// //     .string()
// //     .min(1, "Course is required")
// //     .max(20, "Course ID must be at most 20 characters"),
// //   enrollmentDate: z
// //     .string()
// //     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
// // });

// // const API_URL = "http://localhost:8080";

// // const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
// //   const [page, setPage] = useState(0);
// //   const queryClient = useQueryClient();

// //   const { control, handleSubmit, reset } = useForm({
// //     resolver: zodResolver(enrollSchema),
// //     defaultValues: {
// //       courseId: "",
// //       enrollmentDate: new Date().toISOString().split("T")[0],
// //     },
// //   });

// //   const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
// //     queryKey: ["enrollments", userId, page],
// //     queryFn: async () => {
// //       const response = await axios.get(
// //         `${API_URL}/api/enroll/student/${userId}`,
// //         {
// //           params: { offset: page * 10, limit: 10 },
// //         }
// //       );
// //       return response.data;
// //     },
// //   });

// //   const { data: courses, isLoading: coursesLoading } = useQuery({
// //     queryKey: ["courses"],
// //     queryFn: async () => {
// //       const response = await axios.get(`${API_URL}/api/course`);
// //       return response.data.data;
// //     },
// //   });

// //   const enrollMutation = useMutation({
// //     mutationFn: (data: { courseId: string; enrollmentDate: string }) =>
// //       axios.post(`${API_URL}/api/enroll`, {
// //         studentId: userId,
// //         courseId: data.courseId,
// //         enrollmentDate: data.enrollmentDate,
// //       }),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
// //       reset();
// //       toast.success("Enrolled successfully");
// //     },
// //     onError: (error: any) => {
// //       toast.error(error.response?.data?.error || "Failed to enroll");
// //     },
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: (enrollmentId: number) =>
// //       axios.delete(`${API_URL}/api/enroll/${enrollmentId}`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
// //       toast.success("Enrollment removed successfully");
// //     },
// //     onError: (error: any) => {
// //       toast.error(error.response?.data?.error || "Failed to remove enrollment");
// //     },
// //   });

// //   const onSubmit = (data: { courseId: string; enrollmentDate: string }) => {
// //     enrollMutation.mutate(data);
// //   };

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Manage Enrollments</h1>
// //       <div className="mb-4">
// //         <form
// //           onSubmit={handleSubmit(onSubmit)}
// //           className="grid grid-cols-1 md:grid-cols-3 gap-2"
// //         >
// //           <Controller
// //             name="courseId"
// //             control={control}
// //             render={({ field, fieldState }) => (
// //               <div>
// //                 <Select onValueChange={field.onChange} value={field.value}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select Course" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {courses?.map((course: Course) => (
// //                       <SelectItem key={course.courseId} value={course.courseId}>
// //                         {course.name}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //                 {fieldState.error && (
// //                   <p className="text-red-500 text-sm">
// //                     {fieldState.error.message}
// //                   </p>
// //                 )}
// //               </div>
// //             )}
// //           />
// //           <Controller
// //             name="enrollmentDate"
// //             control={control}
// //             render={({ field, fieldState }) => (
// //               <div>
// //                 <Input {...field} placeholder="Enrollment Date (YYYY-MM-DD)" />
// //                 {fieldState.error && (
// //                   <p className="text-red-500 text-sm">
// //                     {fieldState.error.message}
// //                   </p>
// //                 )}
// //               </div>
// //             )}
// //           />
// //           <Button type="submit" disabled={enrollMutation.isPending}>
// //             Enroll
// //           </Button>
// //         </form>
// //       </div>
// //       {enrollmentsLoading || coursesLoading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <>
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Course ID</TableHead>
// //                 <TableHead>Course Name</TableHead>
// //                 <TableHead>Enrollment Date</TableHead>
// //                 <TableHead>Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {enrollments?.map((enroll: Enrolls) => (
// //                 <TableRow key={enroll.enrollmentId}>
// //                   <TableCell>{enroll.course.courseId}</TableCell>
// //                   <TableCell>{enroll.course.name}</TableCell>
// //                   <TableCell>{enroll.enrollmentDate}</TableCell>
// //                   <TableCell>
// //                     <Button
// //                       variant="destructive"
// //                       onClick={() => deleteMutation.mutate(enroll.enrollmentId)}
// //                       disabled={deleteMutation.isPending}
// //                     >
// //                       Remove
// //                     </Button>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //           <div className="flex gap-2 mt-4">
// //             <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
// //               Previous
// //             </Button>
// //             <Button
// //               disabled={enrollments?.length < 10}
// //               onClick={() => setPage(page + 1)}
// //             >
// //               Next
// //             </Button>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default StudentEnrollments;
  

// //  // for a student update the frontend for the student enrollment page to the CRUD operation for enrollments as a student




// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import * as React from "react";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import { Course, Enrolls } from "../types";

// interface StudentEnrollmentsProps {
//   userId: string;
// }

// const enrollSchema = z.object({
//   courseId: z
//     .string()
//     .min(1, "Course is required")
//     .max(20, "Course ID must be at most 20 characters"),
//   enrollmentDate: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
// });

// const updateEnrollSchema = z.object({
//   enrollmentDate: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
// });

// const API_URL = "http://localhost:8080";

// const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
//   const [page, setPage] = useState(0);
//   const [editingEnrollment, setEditingEnrollment] = useState<Enrolls | null>(null);
//   const queryClient = useQueryClient();

//   // Form for creating new enrollments
//   const { control, handleSubmit, reset } = useForm({
//     resolver: zodResolver(enrollSchema),
//     defaultValues: {
//       courseId: "",
//       enrollmentDate: new Date().toISOString().split("T")[0],
//     },
//   });

//   // Form for updating enrollments
//   const {
//     control: updateControl,
//     handleSubmit: handleUpdateSubmit,
//     reset: resetUpdate,
//     formState: { errors: updateErrors },
//   } = useForm({
//     resolver: zodResolver(updateEnrollSchema),
//     defaultValues: {
//       enrollmentDate: "",
//     },
//   });

//   // Fetch enrollments
//   const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
//     queryKey: ["enrollments", userId, page],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${API_URL}/api/enroll/student/${userId}`,
//         {
//           params: { offset: page * 10, limit: 10 },
//         }
//       );
//       return response.data;
//     },
//   });

//   // Fetch courses
//   const { data: courses, isLoading: coursesLoading } = useQuery({
//     queryKey: ["courses"],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/course`);
//       return response.data.data;
//     },
//   });

//   // Create enrollment mutation
//   const enrollMutation = useMutation({
//     mutationFn: (data: { courseId: string; enrollmentDate: string }) =>
//       axios.post(`${API_URL}/api/enroll`, {
//         studentId: userId,
//         courseId: data.courseId,
//         enrollmentDate: data.enrollmentDate,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
//       reset();
//       toast.success("Enrolled successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || "Failed to enroll");
//     },
//   });

//   // Update enrollment mutation
//   const updateMutation = useMutation({
//     mutationFn: (data: { enrollmentId: number; enrollmentDate: string }) =>
//       axios.put(`${API_URL}/api/enroll/${data.enrollmentId}`, {
//         studentId: userId,
//         courseId: editingEnrollment?.course.courseId,
//         enrollmentDate: data.enrollmentDate,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
//       setEditingEnrollment(null);
//       resetUpdate();
//       toast.success("Enrollment updated successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || "Failed to update enrollment");
//     },
//   });

//   // Delete enrollment mutation
//   const deleteMutation = useMutation({
//     mutationFn: (enrollmentId: number) =>
//       axios.delete(`${API_URL}/api/enroll/${enrollmentId}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
//       toast.success("Enrollment removed successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || "Failed to remove enrollment");
//     },
//   });

//   // Handle create enrollment
//   const onSubmit = (data: { courseId: string; enrollmentDate: string }) => {
//     enrollMutation.mutate(data);
//   };

//   // Handle update enrollment
//   const onUpdateSubmit = (data: { enrollmentDate: string }) => {
//     if (editingEnrollment) {
//       updateMutation.mutate({
//         enrollmentId: editingEnrollment.enrollmentId,
//         enrollmentDate: data.enrollmentDate,
//       });
//     }
//   };

//   // Start editing an enrollment
//   const startEditing = (enrollment: Enrolls) => {
//     setEditingEnrollment(enrollment);
//     resetUpdate({ enrollmentDate: enrollment.enrollmentDate });
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingEnrollment(null);
//     resetUpdate();
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Manage Enrollments</h1>

//       {/* Create Enrollment Form */}
//       <div className="mb-4">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 md:grid-cols-3 gap-2"
//         >
//           <Controller
//             name="courseId"
//             control={control}
//             render={({ field, fieldState }) => (
//               <div>
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Course" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {courses?.map((course: Course) => (
//                       <SelectItem key={course.courseId} value={course.courseId}>
//                         {course.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {fieldState.error && (
//                   <p className="text-red-500 text-sm">
//                     {fieldState.error.message}
//                   </p>
//                 )}
//               </div>
//             )}
//           />
//           <Controller
//             name="enrollmentDate"
//             control={control}
//             render={({ field, fieldState }) => (
//               <div>
//                 <Input {...field} placeholder="Enrollment Date (YYYY-MM-DD)" />
//                 {fieldState.error && (
//                   <p className="text-red-500 text-sm">
//                     {fieldState.error.message}
//                   </p>
//                 )}
//               </div>
//             )}
//           />
//           <Button type="submit" disabled={enrollMutation.isPending}>
//             Enroll
//           </Button>
//         </form>
//       </div>

//       {/* Update Enrollment Form (Modal-like) */}
//       {editingEnrollment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
//             <form
//               onSubmit={handleUpdateSubmit(onUpdateSubmit)}
//               className="grid grid-cols-1 gap-2"
//             >
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Course (Cannot be changed)
//                 </label>
//                 <Input
//                   value={editingEnrollment.course.name}
//                   disabled
//                   className="mt-1"
//                 />
//               </div>
//               <Controller
//                 name="enrollmentDate"
//                 control={updateControl}
//                 render={({ field }) => (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Enrollment Date
//                     </label>
//                     <Input
//                       {...field}
//                       placeholder="Enrollment Date (YYYY-MM-DD)"
//                       className="mt-1"
//                     />
//                     {updateErrors.enrollmentDate && (
//                       <p className="text-red-500 text-sm">
//                         {updateErrors.enrollmentDate.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               />
//               <div className="flex gap-2 mt-4">
//                 <Button type="submit" disabled={updateMutation.isPending}>
//                   Save
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={cancelEditing}
//                   disabled={updateMutation.isPending}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Enrollments Table */}
//       {enrollmentsLoading || coursesLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Course ID</TableHead>
//                 <TableHead>Course Name</TableHead>
//                 <TableHead>Enrollment Date</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {enrollments?.map((enroll: Enrolls) => (
//                 <TableRow key={enroll.enrollmentId}>
//                   <TableCell>{enroll.course.courseId}</TableCell>
//                   <TableCell>{enroll.course.name}</TableCell>
//                   <TableCell>{enroll.enrollmentDate}</TableCell>
//                   <TableCell className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => startEditing(enroll)}
//                       disabled={updateMutation.isPending}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={() => deleteMutation.mutate(enroll.enrollmentId)}
//                       disabled={deleteMutation.isPending}
//                     >
//                       Remove
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <div className="flex gap-2 mt-4">
//             <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
//               Previous
//             </Button>
//             <Button
//               disabled={enrollments?.length < 10}
//               onClick={() => setPage(page + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentEnrollments;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Course, Enrolls } from "../types";

interface StudentEnrollmentsProps {
  userId: string;
}

const enrollSchema = z.object({
  courseId: z
    .string()
    .min(1, "Course is required")
    .max(20, "Course ID must be at most 20 characters"),
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

const updateEnrollSchema = z.object({
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

const API_URL = "http://localhost:8080";

const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrolls | null>(null);
  const queryClient = useQueryClient();

  // Form for creating new enrollments
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      courseId: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    },
  });

  // Form for updating enrollments
  const {
    control: updateControl,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm({
    resolver: zodResolver(updateEnrollSchema),
    defaultValues: {
      enrollmentDate: "",
    },
  });

  // Fetch enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", userId, page],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/enroll/student/${userId}`,
        {
          params: { offset: page * 10, limit: 10 },
        }
      );
      return response.data; // Backend returns List<EnrollsDTO>
    },
  });

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/course`);
      return response.data.data; // Backend returns { data: Course[] }
    },
  });

  // Create enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (data: { courseId: string; enrollmentDate: string }) =>
      axios.post(`${API_URL}/api/enroll`, {
        studentId: userId,
        courseId: data.courseId,
        enrollmentDate: data.enrollmentDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
      reset();
      toast.success("Enrolled successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to enroll";
      toast.error(message);
    },
  });

  // Update enrollment mutation
  const updateMutation = useMutation({
    mutationFn: (data: { enrollmentId: number; enrollmentDate: string }) =>
      axios.put(`${API_URL}/api/enroll/${data.enrollmentId}`, {
        studentId: userId,
        courseId: editingEnrollment?.courseId,
        enrollmentDate: data.enrollmentDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
      setEditingEnrollment(null);
      resetUpdate();
      toast.success("Enrollment updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update enrollment";
      toast.error(message);
    },
  });

  // Delete enrollment mutation
  const deleteMutation = useMutation({
    mutationFn: (enrollmentId: number) =>
      axios.delete(`${API_URL}/api/enroll/${enrollmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
      toast.success("Enrollment removed successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to remove enrollment";
      toast.error(message);
    },
  });

  // Handle create enrollment
  const onSubmit = (data: { courseId: string; enrollmentDate: string }) => {
    enrollMutation.mutate(data);
  };

  // Handle update enrollment
  const onUpdateSubmit = (data: { enrollmentDate: string }) => {
    if (editingEnrollment) {
      updateMutation.mutate({
        enrollmentId: editingEnrollment.enrollmentId,
        enrollmentDate: data.enrollmentDate,
      });
    }
  };

  // Start editing an enrollment
  const startEditing = (enrollment: Enrolls) => {
    setEditingEnrollment(enrollment);
    resetUpdate({ enrollmentDate: enrollment.enrollmentDate });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingEnrollment(null);
    resetUpdate();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Enrollments</h1>

      {/* Create Enrollment Form */}
      <div className="mb-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <Controller
            name="courseId"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course: Course) => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="enrollmentDate"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Input {...field} placeholder="Enrollment Date (YYYY-MM-DD)" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Button type="submit" disabled={enrollMutation.isPending}>
            {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
          </Button>
        </form>
      </div>

      {/* Update Enrollment Form (Modal-like) */}
      {editingEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
            <form
              onSubmit={handleUpdateSubmit(onUpdateSubmit)}
              className="grid grid-cols-1 gap-2"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course (Cannot be changed)
                </label>
                <Input
                  value={
                    courses?.find((c: Course) => c.courseId === editingEnrollment.courseId)?.name ||
                    editingEnrollment.courseId
                  }
                  disabled
                  className="mt-1"
                />
              </div>
              <Controller
                name="enrollmentDate"
                control={updateControl}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Enrollment Date
                    </label>
                    <Input
                      {...field}
                      placeholder="Enrollment Date (YYYY-MM-DD)"
                      className="mt-1"
                    />
                    {updateErrors.enrollmentDate && (
                      <p className="text-red-500 text-sm">
                        {updateErrors.enrollmentDate.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollments Table */}
      {enrollmentsLoading || coursesLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course ID</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments?.map((enroll: Enrolls) => (
                <TableRow key={enroll.enrollmentId}>
                  <TableCell>{enroll.courseId}</TableCell>
                  <TableCell>
                    {courses?.find((c: Course) => c.courseId === enroll.courseId)?.name ||
                      enroll.courseId}
                  </TableCell>
                  <TableCell>{enroll.enrollmentDate}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => startEditing(enroll)}
                      disabled={updateMutation.isPending}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(enroll.enrollmentId)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Removing..." : "Remove"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2 mt-4">
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button
              disabled={enrollments?.length < 10}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentEnrollments;