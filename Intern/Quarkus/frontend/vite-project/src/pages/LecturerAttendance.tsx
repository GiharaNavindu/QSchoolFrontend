import * as React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';
import { Lecture, Student } from '../types';

interface LecturerAttendanceProps {
  userId: string;
}

const API_URL =  'http://localhost:8080';

const LecturerAttendance: React.FC<LecturerAttendanceProps> = ({ userId }) => {
  const [lectureId, setLectureId] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: lectures, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/lecture`);
      return response.data.filter((lecture: Lecture) => lecture.lecturer?.lecturerId === userId);
    },
  });

  const { data: attendance, isLoading: attendanceLoading, refetch } = useQuery({
    queryKey: ['attendance', lectureId],
    queryFn: async () => {
      if (!lectureId) return [];
      const response = await axios.get(`${API_URL}/api/attendance/lecture/${lectureId}`);
      return response.data;
    },
    enabled: !!lectureId,
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (data: { student: Student; lecture: Lecture; attended: boolean }) =>
      axios.post(`${API_URL}/api/attendance/mark`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', lectureId] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
    },
  });

  const handleMarkAttendance = (student: Student, attended: boolean) => {
    const selectedLecture = lectures?.find((lecture: Lecture) => lecture.lectureId === parseInt(lectureId));
    if (!selectedLecture) {
      toast.error('Lecture not found');
      return;
    }
    markAttendanceMutation.mutate({
      student,
      lecture: selectedLecture,
      attended,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
      <Select value={lectureId} onValueChange={setLectureId}>
        <SelectTrigger className="w-[200px] mb-4">
          <SelectValue placeholder="Select Lecture" />
        </SelectTrigger>
        <SelectContent>
          {lectures?.map((lecture: Lecture) => (
            <SelectItem key={lecture.lectureId} value={lecture.lectureId.toString()}>
              {lecture.module?.name} - {lecture.time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {lecturesLoading || attendanceLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance?.map((att: any) => (
              <TableRow key={att.attendanceId}>
                <TableCell>{att.student.studentId}</TableCell>
                <TableCell>{att.student.firstName} {att.student.lastName}</TableCell>
                <TableCell>{att.attended ? 'Present' : 'Absent'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleMarkAttendance(att.student, !att.attended)}
                    disabled={markAttendanceMutation.isPending}
                  >
                    Mark {att.attended ? 'Absent' : 'Present'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LecturerAttendance;