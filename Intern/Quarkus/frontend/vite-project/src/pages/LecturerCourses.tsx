import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Course } from '../types';

interface LecturerCoursesProps {
  userId: string;
}

const LecturerCourses: React.FC<LecturerCoursesProps> = ({ userId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({ courseId: '', name: '', duration: 0 });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/course`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCreate = () => {
    axios.post(`http://localhost:8080/api/course`, newCourse)
      .then(res => {
        setCourses([...courses, res.data]);
        setNewCourse({ courseId: '', name: '', duration: 0 });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (courseId: string) => {
    axios.delete(`http://localhost:8080/api/course/${courseId}`)
      .then(() => setCourses(courses.filter(c => c.courseId !== courseId)))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      <div className="text-2xl font-bold mb-4">
      <p className="text-lg mb-2">Add New Course</p>
        <div className="mb-4 grid grid-cols- md:grid-cols-3 gap-2">
        <Input
          placeholder="Course ID"
          value={newCourse.courseId}
          onChange={e => setNewCourse({ ...newCourse, courseId: e.target.value })}
        />
        <Input
          placeholder="Course Name"
          value={newCourse.name}
          onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Duration"
          value={newCourse.duration}
          onChange={e => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) || 0 })}
        />
        <Button onClick={handleCreate} disabled={!newCourse.courseId || !newCourse.name}>
          Add Course
        </Button>
      </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(course.courseId)}
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

export default LecturerCourses;