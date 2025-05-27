import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '../types';
import { useNavigate } from 'react-router-dom';

interface StudentDetailsProps {
  userId: string;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ userId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/student/${userId}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleUpdate = () => {
    if (student) {
      axios.put(`http://localhost:8080/api/student/${userId}`, student)
        .then(() => navigate(`/student/${userId}`))
        .catch(err => console.error(err));
    }
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={student.firstName}
            onChange={e => setStudent({ ...student, firstName: e.target.value })}
            placeholder="First Name"
          />
          <Input
            value={student.lastName}
            onChange={e => setStudent({ ...student, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <Input
            type="email"
            value={student.email}
            onChange={e => setStudent({ ...student, email: e.target.value })}
            placeholder="Email"
          />
          <Input
            type="number"
            value={student.age || ''}
            onChange={e => setStudent({ ...student, age: parseInt(e.target.value) || undefined })}
            placeholder="Age"
          />
          <Input
            value={student.address || ''}
            onChange={e => setStudent({ ...student, address: e.target.value })}
            placeholder="Address"
          />
          <Input
            value={student.batch || ''}
            onChange={e => setStudent({ ...student, batch: e.target.value })}
            placeholder="Batch"
          />
          <Button onClick={handleUpdate}>Update</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;