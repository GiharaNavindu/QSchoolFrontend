import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Module, Lecture } from '../types';

interface LecturerDashboardProps {
  userId: string;
}



const API_URL =  'http://localhost:8080';

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/module/lecturer/${userId}`);
      return response.data;
    },
  });

  const { data: lectures, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/lecture`, {
        params: { filterModule: modules?.map((m: Module) => m.moduleId).join(',') },
      });
      return response.data.data.filter((lecture: Lecture) => new Date(lecture.time) >= new Date());
    },
    enabled: !!modules,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lecturer Dashboard</h1>
      {(modulesLoading || lecturesLoading) ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Modules</CardTitle>
            </CardHeader>
            <CardContent>
              {modules?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module: Module) => (
                      <TableRow key={module.moduleId}>
                        <TableCell>{module.moduleId}</TableCell>
                        <TableCell>{module.name}</TableCell>
                        <TableCell>{module.numberOfCredits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No modules assigned.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              {lectures?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures.map((lecture: Lecture) => (
                      <TableRow key={lecture.lectureId}>
                        <TableCell>{lecture.module?.name}</TableCell>
                        <TableCell>{lecture.venue || 'N/A'}</TableCell>
                        <TableCell>{new Date(lecture.time).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No upcoming lectures.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;