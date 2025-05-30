

import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Course, Module } from '../types';

interface LecturerCoursesProps {
  userId: string;
}

const courseSchema = z.object({
  courseId: z
    .string()
    .min(1, 'Course ID is required')
    .max(20, 'Course ID must be at most 20 characters'),
  name: z
    .string()
    .min(1, 'Course name is required')
    .max(100, 'Course name must be at most 100 characters'),
  duration: z.number().min(0, 'Duration must be non-negative').optional(),
});

const moduleAssignSchema = z.object({
  moduleId: z.string().min(1, 'Module is required'),
  courseId: z.string().min(1, 'Course is required'),
});

const API_URL = 'http://localhost:8080';

const LecturerCourses: React.FC<LecturerCoursesProps> = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filterName, setFilterName] = useState('');

  const queryClient = useQueryClient();

  const courseForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { courseId: '', name: '', duration: 0 },
  });

  const moduleForm = useForm({
    resolver: zodResolver(moduleAssignSchema),
    defaultValues: { moduleId: '', courseId: '' },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', page, sortBy, sortDir, filterName],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/course`, {
        params: { offset: page * 10, limit: 10, sortBy, sortDir, filterName },
      });
      return response.data;
    },
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/module`);
      return response.data.data;
    },
  });

  // // Fetch modules for each course
  // const { data: courseModules, isLoading: courseModulesLoading } = useQuery({
  //   queryKey: ['courseModules', courses?.data],
  //   queryFn: async () => {
  //     if (!courses?.data) return {};
  //     const modulePromises = courses.data.map((course: Course) =>
  //       axios
  //         .get(`${API_URL}/api/module/course`, {
  //           params: { courseId: course.courseId },
  //         })
  //         .then((response) => ({ [course.courseId]: response.data }))
  //         .catch(() => ({ [course.courseId]: [] }))
  //     );
  //     const moduleResults = await Promise.all(modulePromises);
  //     return Object.assign({}, ...moduleResults);
  //   },
  //   enabled: !!courses?.data,
  // });

  const { data: courseModules, isLoading: courseModulesLoading } = useQuery({
  queryKey: ['courseModules', courses?.data],
  queryFn: async () => {
    if (!courses?.data) return {};
    const modulePromises = courses.data.map((course: Course) =>
      axios
        .get(`${API_URL}/api/module/course`, {
          params: { courseId: course.courseId },
        })
        .then((response) => ({ [course.courseId]: response.data }))
        .catch(() => ({ [course.courseId]: [] }))
    );
    const moduleResults = await Promise.all(modulePromises);
    return Object.assign({}, ...moduleResults);
  },
  enabled: !!courses?.data,
});

  const createCourseMutation = useMutation({
    mutationFn: (data: Course) => axios.post(`${API_URL}/api/course`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      courseForm.reset();
      toast.success('Course created successfully', {
        style: { background: '#22c55e', color: '#fff' },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create course', {
        style: { background: '#ef4444', color: '#fff' },
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) =>
      axios.delete(`${API_URL}/api/course/${courseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully', {
        style: { background: '#22c55e', color: '#fff' },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete course', {
        style: { background: '#ef4444', color: '#fff' },
      });
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
      queryClient.invalidateQueries({ queryKey: ['courses', 'courseModules'] });
      moduleForm.reset();
      toast.success('Module assigned successfully', {
        style: { background: '#22c55e', color: '#fff' },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to assign module', {
        style: { background: '#ef4444', color: '#fff' },
      });
    },
  });

  const onCourseSubmit = (data: Course) => {
    createCourseMutation.mutate(data);
  };

  const onModuleSubmit = (data: { moduleId: string; courseId: string }) => {
    assignModuleMutation.mutate(data);
  };

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Manage Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Create Course</h2>
              <Form {...courseForm}>
                <form
                  onSubmit={courseForm.handleSubmit(onCourseSubmit)}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <FormField
                    control={courseForm.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter course ID"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter course name"
                            className="transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (hours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            placeholder="Enter duration"
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
                          disabled={createCourseMutation.isPending}
                          className="w-full"
                        >
                          {createCourseMutation.isPending
                            ? 'Creating...'
                            : 'Add Course'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create a new course</TooltipContent>
                    </Tooltip>
                  </div>
                </form>
              </Form>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Assign Module to Course</h2>
              <Form {...moduleForm}>
                <form
                  onSubmit={moduleForm.handleSubmit(onModuleSubmit)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <FormField
                    control={moduleForm.control}
                    name="moduleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Module" />
                            </SelectTrigger>
                            <SelectContent>
                              {modules?.map((module: Module) => (
                                <SelectItem
                                  key={module.moduleId}
                                  value={module.moduleId}
                                >
                                  {module.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={moduleForm.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses?.data?.map((course: Course) => (
                                <SelectItem
                                  key={course.courseId}
                                  value={course.courseId}
                                >
                                  {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          disabled={assignModuleMutation.isPending}
                          className="w-full"
                        >
                          {assignModuleMutation.isPending
                            ? 'Assigning...'
                            : 'Assign Module'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Assign module to a course</TooltipContent>
                    </Tooltip>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div>
          <Label htmlFor="filterName">Filter by Name</Label>
          <Input
            id="filterName"
            placeholder="Enter course name"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(0);
            }}
            className="w-[300px] mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
          />
        </div>

        {coursesLoading || modulesLoading || courseModulesLoading ? (
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
                        setSortBy('courseId');
                        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      ID {sortBy === 'courseId' && (sortDir === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        setSortBy('name');
                        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses?.data?.map((course: Course) => (
                    <TableRow
                      key={course.courseId}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{course.courseId}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell>
                        {courseModules?.[course.courseId]?.length > 0 ? (
                          courseModules[course.courseId].map((module: Module) => (
                            <Badge key={module.moduleId} variant="secondary" className="mr-1">
                              {module.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No modules assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                deleteCourseMutation.mutate(course.courseId)
                              }
                              disabled={deleteCourseMutation.isPending}
                              aria-label={`Delete course ${course.name}`}
                            >
                              {deleteCourseMutation.isPending
                                ? 'Deleting...'
                                : 'Delete'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete this course</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of{' '}
                  {courses?.data?.length < 10 ? page + 1 : page + 2}
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
                    disabled={courses?.data?.length < 10}
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

export default LecturerCourses;