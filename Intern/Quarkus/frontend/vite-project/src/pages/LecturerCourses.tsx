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
import { Course, Module } from "../types";

interface LecturerCoursesProps {
  userId: string;
}

const courseSchema = z.object({
  courseId: z
    .string()
    .min(1, "Course ID is required")
    .max(20, "Course ID must be at most 20 characters"),
  name: z
    .string()
    .min(1, "Course name is required")
    .max(100, "Course name must be at most 100 characters"),
  duration: z.number().min(0, "Duration must be non-negative").optional(),
});

const moduleAssignSchema = z.object({
  moduleId: z.string().min(1, "Module is required"),
  courseId: z.string().min(1, "Course is required"),
});

const API_URL = "http://localhost:8080";

const LecturerCourses: React.FC<LecturerCoursesProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [filterName, setFilterName] = useState("");

  const queryClient = useQueryClient();

  const {
    control: courseControl,
    handleSubmit: handleCourseSubmit,
    reset: resetCourse,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { courseId: "", name: "", duration: 0 },
  });

  const {
    control: moduleControl,
    handleSubmit: handleModuleSubmit,
    reset: resetModule,
  } = useForm({
    resolver: zodResolver(moduleAssignSchema),
    defaultValues: { moduleId: "", courseId: "" },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", page, sortBy, sortDir, filterName],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/course`, {
        params: { offset: page * 10, limit: 10, sortBy, sortDir, filterName },
      });
      return response.data;
    },
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/module`);
      return response.data.data;
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: Course) => axios.post(`${API_URL}/api/course`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      resetCourse();
      toast.success("Course created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create course");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) =>
      axios.delete(`${API_URL}/api/course/${courseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      toast.success("Course deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete course");
    },
  });

  const assignModuleMutation = useMutation({
    mutationFn: (data: { moduleId: string; courseId: string }) =>
      axios.post(
        `${API_URL}/api/module/assign`,
        {},
        {
          params: { moduleId: data.moduleId, courseId: data.courseId },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      resetModule();
      toast.success("Module assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to assign module");
    },
  });

  const onCourseSubmit = (data: Course) => {
    createCourseMutation.mutate(data);
  };

  const onModuleSubmit = (data: { moduleId: string; courseId: string }) => {
    assignModuleMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
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
        <h2 className="text-lg font-semibold mb-2">Create Course</h2>
        <form
          onSubmit={handleCourseSubmit(onCourseSubmit)}
          className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4"
        >
          <Controller
            name="courseId"
            control={courseControl}
            render={({ field, fieldState }) => (
              <div>
                <Input {...field} placeholder="Course ID" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="name"
            control={courseControl}
            render={({ field, fieldState }) => (
              <div>
                <Input {...field} placeholder="Course Name" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="duration"
            control={courseControl}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  placeholder="Duration"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Button type="submit" disabled={createCourseMutation.isLoading}>
            Add Course
          </Button>
        </form>
        <h2 className="text-lg font-semibold mb-2">Assign Module to Course</h2>
        <form
          onSubmit={handleModuleSubmit(onModuleSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <Controller
            name="moduleId"
            control={moduleControl}
            render={({ field, fieldState }) => (
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
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="courseId"
            control={moduleControl}
            render={({ field, fieldState }) => (
              <div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.data?.map((course: Course) => (
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
          <Button type="submit" disabled={assignModuleMutation.isLoading}>
            Assign Module
          </Button>
        </form>
      </div>
      {coursesLoading || modulesLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => {
                    setSortBy("courseId");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  ID {sortBy === "courseId" && (sortDir === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortBy("name");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  Name {sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.data?.map((course: Course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteCourseMutation.mutate(course.courseId)
                      }
                      disabled={deleteCourseMutation.isLoading}
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
              disabled={courses?.data?.length < 10}
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

export default LecturerCourses;
