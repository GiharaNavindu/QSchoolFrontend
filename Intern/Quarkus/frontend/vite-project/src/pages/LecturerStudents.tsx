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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Student } from "../types";

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

const API_URL =  "http://localhost:8080";

const LecturerStudents: React.FC<LecturerStudentsProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");
  const [filterName, setFilterName] = useState("");

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
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
      queryClient.invalidateQueries(["students"]);
      reset();
      toast.success("Student created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create student");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) =>
      axios.delete(`${API_URL}/api/student/${studentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      toast.success("Student deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete student");
    },
  });

  const onSubmit = (data: Student) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
      <div className="mb-4">
        <Input
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => {
            setFilterName(e.target.value);
            setPage(0);
          }}
          className="w-[200px] mb-2"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-5 gap-2"
        >
          <Controller
            name="studentId"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Input {...field} placeholder="Student ID" />
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
          <Button type="submit" disabled={createMutation.isLoading}>
            Add Student
          </Button>
        </form>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => {
                    setSortBy("studentId");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  ID {sortBy === "studentId" && (sortDir === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortBy("firstName");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  Name{" "}
                  {sortBy === "firstName" && (sortDir === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((student: Student) => (
                <TableRow key={student.studentId}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.batch || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(student.studentId)}
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
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
              disabled={data?.data?.length < 10}
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

export default LecturerStudents;
