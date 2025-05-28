

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Student } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

interface LecturerStudentsProps {
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

const LecturerStudents: React.FC<LecturerStudentsProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");
  const [filterName, setFilterName] = useState("");

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: new Date().toISOString().split("T")[0],
      address: "",
      batch: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["students", page, sortBy, sortDir, filterName],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/student`, {
        params: { offset: page * 10, limit: 10, sortBy, sortDir, filterName },
      });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Student) => axios.post(`${API_URL}/api/student`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      form.reset();
      toast.success("Student created successfully", {
        style: { background: "#22c55e", color: "#fff" },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create student", {
        style: { background: "#ef4444", color: "#fff" },
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) =>
      axios.delete(`${API_URL}/api/student/${studentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully", {
        style: { background: "#22c55e", color: "#fff" },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete student", {
        style: { background: "#ef4444", color: "#fff" },
      });
    },
  });

  const onSubmit = (data: Student) => {
    createMutation.mutate(data);
  };

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Manage Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="filterName">Filter by Name</Label>
              <Input
                id="filterName"
                placeholder="Enter student name"
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setPage(0);
                }}
                className="w-[300px] mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Add New Student</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter student ID"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter first name"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter last name"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter email"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            placeholder="YYYY-MM-DD"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter address"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter batch"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                          className="w-full"
                        >
                          {createMutation.isPending ? "Adding..." : "Add Student"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add a new student</TooltipContent>
                    </Tooltip>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        setSortBy("studentId");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      ID {sortBy === "studentId" && (sortDir === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        setSortBy("firstName");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      Name {sortBy === "firstName" && (sortDir === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((student: Student) => (
                    <TableRow
                      key={student.studentId}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.batch || "N/A"}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(student.studentId)}
                              disabled={deleteMutation.isPending}
                              aria-label={`Delete student ${student.firstName} ${student.lastName}`}
                            >
                              {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete this student</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of {data?.data?.length < 10 ? page + 1 : page + 2}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={data?.data?.length < 10}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default LecturerStudents;