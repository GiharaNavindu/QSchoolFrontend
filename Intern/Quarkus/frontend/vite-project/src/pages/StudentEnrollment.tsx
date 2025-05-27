import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Enrolls, Course } from '../types';

interface StudentEnrollmentsProps {
  userId: string;
}

const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId }) => {
  const [enrollments, setEnrollments] = useState<Enrolls[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newEnrollment, setNewEnrollment] = useState<{ courseId: string }>({ courseId: '' });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/enrolls/student/${userId}`)
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
    axios.get(`http://localhost:8080/api/course`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleCreate = () => {
    axios.post(`http://localhost:8080/api/enrolls`, {
      course: { courseId: newEnrollment.courseId },
      student: { studentId: userId }
    })
      .then(res => {
        setEnrollments([...enrollments, res.data]);
        setNewEnrollment({ courseId: '' });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (enrollmentId: number) => {
    axios.delete(`http://localhost:8080/api/enrolls/${enrollmentId}`)
      .then(() => setEnrollments(enrollments.filter(e => e.enrollmentId !== enrollmentId)))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Enrollments</h1>
      <div className="mb-4 flex items-center gap-2">
        <Select
          value={newEnrollment.courseId}
          onValueChange={value => setNewEnrollment({ courseId: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.courseId} value={course.courseId}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCreate} disabled={!newEnrollment.courseId}>Enroll</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Enrollment Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map(enroll => (
            <TableRow key={enroll.enrollmentId}>
              <TableCell>{enroll.course.name}</TableCell>
              <TableCell>{enroll.enrollmentDate}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(enroll.enrollmentId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentEnrollments;