

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
// import toast, { Toaster } from "react-hot-toast";
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
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
//     .refine((date) => !isNaN(new Date(date).getTime()), {
//       message: "Invalid date",
//     }),
// });

// const updateEnrollSchema = z.object({
//   enrollmentDate: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
//     .refine((date) => !isNaN(new Date(date).getTime()), {
//       message: "Invalid date",
//     }),
// });

// const API_URL = "http://localhost:8080";

// const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
//   const [page, setPage] = useState(0);
//   const [editingEnrollment, setEditingEnrollment] = useState<Enrolls | null>(null);
//   const queryClient = useQueryClient();

//   // Form for creating new enrollments
//   const { control, handleSubmit, reset, formState: { errors } } = useForm({
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
//   const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
//     queryKey: ["enrollments", userId, page],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${API_URL}/api/enroll/student/${userId}`,
//         {
//           params: { offset: page * 10, limit: 10 },
//         }
//       );
//       return response.data; // Backend returns List<EnrollsDTO>
//     },
//   });

//   // Fetch courses
//   const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
//     queryKey: ["courses"],
//     queryFn: async () => {
//       const response = await axios.get(`${API_URL}/api/course`);
//       return response.data.data; // Backend returns { data: Course[] }
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
//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to enroll";
//       toast.error(message);
//     },
//   });

//   // Update enrollment mutation
//   const updateMutation = useMutation({
//     mutationFn: (data: { enrollmentId: number; enrollmentDate: string }) =>
//       axios.put(`${API_URL}/api/enroll/${data.enrollmentId}`, {
//         studentId: userId,
//         courseId: editingEnrollment?.courseId,
//         enrollmentDate: data.enrollmentDate,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
//       setEditingEnrollment(null);
//       resetUpdate();
//       toast.success("Enrollment updated successfully");
//     },
//     onError: (error: any) => {
//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to update enrollment";
//       toast.error(message);
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
//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to remove enrollment";
//       toast.error(message);
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

//   if (enrollmentsError || coursesError) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Manage Enrollments</h1>
//         <p className="text-red-500">Error loading data. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Manage Enrollments</h1>

//       {/* Create Enrollment Form */}
//       <div className="mb-4">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 md:grid-cols-3 gap-4"
//         >
//           <div>
//             <Controller
//               name="courseId"
//               control={control}
//               render={({ field, fieldState }) => (
//                 <div>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={coursesLoading || enrollMutation.isPending}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select Course"} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {courses?.map((course: Course) => (
//                         <SelectItem key={course.courseId} value={course.courseId}>
//                           {course.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {fieldState.error && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {fieldState.error.message}
//                     </p>
//                   )}
//                 </div>
//               )}
//             />
//           </div>
//           <div>
//             <Controller
//               name="enrollmentDate"
//               control={control}
//               render={({ field, fieldState }) => (
//                 <div>
//                   <Input
//                     {...field}
//                     type="date"
//                     placeholder="Enrollment Date (YYYY-MM-DD)"
//                     disabled={enrollMutation.isPending}
//                   />
//                   {fieldState.error && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {fieldState.error.message}
//                     </p>
//                   )}
//                 </div>
//               )}
//             />
//           </div>
//           <Button
//             type="submit"
//             disabled={enrollMutation.isPending || coursesLoading}
//             className="h-10"
//           >
//             {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
//           </Button>
//         </form>
//       </div>

//       {/* Update Enrollment Form (Modal-like) */}
//       {editingEnrollment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
//             <form
//               onSubmit={handleUpdateSubmit(onUpdateSubmit)}
//               className="grid grid-cols-1 gap-4"
//             >
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Course (Cannot be changed)
//                 </label>
//                 <Input
//                   value={
//                     courses?.find((c: Course) => c.courseId === editingEnrollment.courseId)?.name ||
//                     editingEnrollment.courseId
//                   }
//                   disabled
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Enrollment Date
//                 </label>
//                 <Controller
//                   name="enrollmentDate"
//                   control={updateControl}
//                   render={({ field }) => (
//                     <Input
//                       {...field}
//                       type="date"
//                       placeholder="Enrollment Date (YYYY-MM-DD)"
//                       className="mt-1"
//                       disabled={updateMutation.isPending}
//                     />
//                   )}
//                 />
//                 {updateErrors.enrollmentDate && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {updateErrors.enrollmentDate.message}
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-2 mt-4">
//                 <Button
//                   type="submit"
//                   disabled={updateMutation.isPending}
//                 >
//                   {updateMutation.isPending ? "Saving..." : "Save"}
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
//         <div className="space-y-2">
//           <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
//           <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
//           <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
//         </div>
//       ) : enrollments?.length === 0 ? (
//         <p className="text-gray-500">No enrollments found. Enroll in a course above.</p>
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
//                   <TableCell>{enroll.courseId}</TableCell>
//                   <TableCell>
//                     {courses?.find((c: Course) => c.courseId === enroll.courseId)?.name ||
//                       enroll.courseId}
//                   </TableCell>
//                   <TableCell>{enroll.enrollmentDate}</TableCell>
//                   <TableCell className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => startEditing(enroll)}
//                       disabled={updateMutation.isPending || deleteMutation.isPending}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={() => deleteMutation.mutate(enroll.enrollmentId)}
//                       disabled={deleteMutation.isPending || updateMutation.isPending}
//                     >
//                       {deleteMutation.isPending ? "Removing..." : "Remove"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <div className="flex gap-2 mt-4">
//             <Button
//               variant="outline"
//               disabled={page === 0}
//               onClick={() => setPage(page - 1)}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               disabled={enrollments?.length < 10}
//               onClick={() => setPage(page + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default StudentEnrollments;



// No changes in imports
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
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { Course, Enrolls } from "../types";

interface StudentEnrollmentsProps {
  userId: string;
}

// Schemas (unchanged)
const enrollSchema = z.object({
  courseId: z.string().min(1, "Course is required").max(20),
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date",
    }),
});
const updateEnrollSchema = z.object({
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date",
    }),
});

const API_URL = "http://localhost:8080";

const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrolls | null>(null);
  const queryClient = useQueryClient();

  // Create form
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      courseId: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    },
  });

  // Update form
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

  // Fetch data
  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ["enrollments", userId, page],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/enroll/student/${userId}`, {
        params: { offset: page * 10, limit: 10 },
      });
      return response.data;
    },
  });

  const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/course`);
      return response.data.data;
    },
  });

  const enrollMutation = useMutation({
    mutationFn: (data: { courseId: string; enrollmentDate: string }) =>
      axios.post(`${API_URL}/api/enroll`, {
        studentId: userId,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
      reset();
      toast.success("Enrolled successfully");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to enroll";
      toast.error(msg);
    },
  });

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
      toast.success("Enrollment updated");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (enrollmentId: number) =>
      axios.delete(`${API_URL}/api/enroll/${enrollmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
      toast.success("Enrollment removed");
    },
    onError: () => toast.error("Failed to remove enrollment"),
  });

  const onSubmit = (data: { courseId: string; enrollmentDate: string }) =>
    enrollMutation.mutate(data);
  const onUpdateSubmit = (data: { enrollmentDate: string }) =>
    editingEnrollment &&
    updateMutation.mutate({
      enrollmentId: editingEnrollment.enrollmentId,
      enrollmentDate: data.enrollmentDate,
    });

  const startEditing = (enroll: Enrolls) => {
    setEditingEnrollment(enroll);
    resetUpdate({ enrollmentDate: enroll.enrollmentDate });
  };

  const cancelEditing = () => {
    setEditingEnrollment(null);
    resetUpdate();
  };

  if (enrollmentsError || coursesError) {
    return <div className="p-6 text-red-600">Failed to load data.</div>;
  }

  return (
    <div className="p-6 bg-[#F3F4F6] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">Manage Enrollments</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div>
          <Controller
            name="courseId"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Select onValueChange={field.onChange} value={field.value} disabled={coursesLoading}>
                  <SelectTrigger className="bg-white border border-[#1E3A8A] text-[#1E3A8A]">
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
                {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            name="enrollmentDate"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="date"
                  className="border border-[#1E3A8A] text-[#1E3A8A]"
                  disabled={enrollMutation.isPending}
                />
                {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={enrollMutation.isPending}
          className="bg-[#1E3A8A] text-white hover:bg-[#33419B]"
        >
          {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
        </Button>
      </form>

      {/* Edit Modal */}
      {editingEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#1E3A8A]">Edit Enrollment</h2>
            <form onSubmit={handleUpdateSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course (unchangeable)
                </label>
                <Input
                  value={
                    courses?.find((c) => c.courseId === editingEnrollment.courseId)?.name ||
                    editingEnrollment.courseId
                  }
                  disabled
                  className="border border-gray-300 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                <Controller
                  name="enrollmentDate"
                  control={updateControl}
                  render={({ field }) => (
                    <Input {...field} type="date" className="border border-[#1E3A8A]" />
                  )}
                />
                {updateErrors.enrollmentDate && (
                  <p className="text-red-500 text-sm">{updateErrors.enrollmentDate.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-[#1E3A8A] text-white">
                  Save
                </Button>
                <Button type="button" onClick={cancelEditing} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {enrollmentsLoading || coursesLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : enrollments?.length === 0 ? (
          <div className="p-6 text-gray-500">No enrollments found.</div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-[#1E3A8A] text-white">
                <TableRow>
                  <TableHead className="text-white">Course ID</TableHead>
                  <TableHead className="text-white">Course Name</TableHead>
                  <TableHead className="text-white">Enrollment Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enroll: Enrolls) => (
                  <TableRow key={enroll.enrollmentId}>
                    <TableCell>{enroll.courseId}</TableCell>
                    <TableCell>
                      {courses?.find((c) => c.courseId === enroll.courseId)?.name || enroll.courseId}
                    </TableCell>
                    <TableCell>{enroll.enrollmentDate}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => startEditing(enroll)}
                        className="border-[#1E3A8A] text-[#1E3A8A]"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(enroll.enrollmentId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between p-4">
              <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 0}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={enrollments.length < 10}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default StudentEnrollments;
