import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '../types';

interface LecturerStudentsProps {
  userId: string;
}

const LecturerStudents: React.FC<LecturerStudentsProps> = ({ userId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: new Date().toISOString().split('T')[0],
    address: '',
    batch: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/student`)
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCreate = () => {
    axios.post(`http://localhost:8080/api/student`, newStudent)
      .then(res => {
        setStudents([...students, res.data]);
        setNewStudent({
          studentId: '',
          firstName: '',
          lastName: '',
          email: '',
          dob: new Date().toISOString().split('T')[0],
          address: '',
          batch: ''
        });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (studentId: string) => {
    axios.delete(`http://localhost:8080/api/student/${studentId}`)
      .then(() => setStudents(students.filter(s => s.studentId !== studentId)))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input
          placeholder="Student ID"
          value={newStudent.studentId}
          onChange={e => setNewStudent({ ...newStudent, studentId: e.target.value })}
        />
        <Input
          placeholder="First Name"
          value={newStudent.firstName}
          onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })}
        />
        <Input
          placeholder="Last Name"
          value={newStudent.lastName}
          onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
        />
        <Input
          type="date"
          value={newStudent.dob}
          onChange={e => setNewStudent({ ...newStudent, dob: e.target.value })}
        />
        <Input
          placeholder="Address"
          value={newStudent.address}
          onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
        />
        <Input
          placeholder="Batch"
          value={newStudent.batch}
          onChange={e => setNewStudent({ ...newStudent, batch: e.target.value })}
        />
        <Button onClick={handleCreate} disabled={!newStudent.studentId || !newStudent.email}>
          Add Student
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.studentId}>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.firstName} {student.lastName}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(student.studentId)}
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

export default LecturerStudents;