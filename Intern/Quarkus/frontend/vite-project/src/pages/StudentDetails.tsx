import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { useForm } from "react-hook-form";
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

const API_URL = "http://localhost:8080";

const StudentDetails: React.FC<StudentDetailsProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  // const form = useForm({
  //   resolver: zodResolver(studentSchema),
  //   defaultValues: {
  //     studentId: "",
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     dob: "",
  //     address: "",
  //     batch: "",
  //   },
  // });

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      batch: "",
      address: "",
    },
  });

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/student/${userId}`);
      return response.data;
    },
  });

  React.useEffect(() => {
    if (student) {
      form.reset({
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        dob: student.dob,
        address: student.address || "",
        batch: student.batch || "",
      });
    }
  }, [student, form.reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Student) =>
      axios.put(`${API_URL}/api/student/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", userId] });
      toast.success("Profile updated successfully", {
        style: { background: "#22c55e", color: "#fff" },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update profile", {
        style: { background: "#ef4444", color: "#fff" },
      });
    },
  });

  const onSubmit = (data: Student) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-[200px] mb-4" />
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    // <TooltipProvider>
    <div className="p-6 max-w-5xl mx-auto bg-[#F3F4F6] min-h-screen">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-2xl px-6 py-5">
          <CardTitle className="text-3xl font-semibold text-[#1E3A8A]">
            Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* STUDENT ID */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">Student ID</FormLabel>
                    <FormControl>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            {...field}
                            disabled
                            className="bg-gray-100 text-gray-600 border-gray-300 cursor-not-allowed"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          Student ID cannot be edited
                        </TooltipContent>
                      </Tooltip>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIRST NAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter first name"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LAST NAME */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter last name"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter address"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BATCH */}
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E3A8A]">Batch</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter batch"
                        className="transition border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-2 flex justify-end mt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white px-6 py-2 rounded-md shadow-sm transition"
                    >
                      {updateMutation.isPending
                        ? "Updating..."
                        : "Update Profile"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Save changes to student profile
                  </TooltipContent>
                </Tooltip>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    // </TooltipProvider>
  );
};

export default StudentDetails;
