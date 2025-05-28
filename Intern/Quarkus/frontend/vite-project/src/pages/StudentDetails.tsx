import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Student } from "../types";

interface StudentDetailsProps {
  userId: string;
}

const studentSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .max(64, "Student ID must be at most 64 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(255, "First name must be at most 255 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(255, "Last name must be at most 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters")
    .optional(),
  batch: z.string().max(50, "Batch must be at most 50 characters").optional(),
});

const API_URL =  "http://localhost:8080";

const StudentDetails: React.FC<StudentDetailsProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/student/${userId}`);
      return response.data;
    },
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      address: "",
      batch: "",
    },
  });

  React.useEffect(() => {
    if (student) {
      reset({
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        dob: student.dob,
        address: student.address || "",
        batch: student.batch || "",
      });
    }
  }, [student, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Student) =>
      axios.put(`${API_URL}/api/student/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["student", userId]);
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update profile");
    },
  });

  const onSubmit = (data: Student) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Controller
              name="studentId"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Student ID" disabled />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="First Name" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Last Name" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Email" type="email" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="dob"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Date of Birth (YYYY-MM-DD)" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Address" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="batch"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input {...field} placeholder="Batch" />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Button type="submit" disabled={updateMutation.isLoading}>
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;
