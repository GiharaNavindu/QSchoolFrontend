import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lecturer, Module } from '../types';

interface LecturerDashboardProps {
  userId: string;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/lecturer/${userId}`)
      .then(res => setLecturer(res.data))
      .catch(err => console.error(err));
    axios.get(`http://localhost:8080/api/module/lecturer/${userId}`)
      .then(res => setModules(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lecturer Dashboard</h1>
      {lecturer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {lecturer.firstName} {lecturer.lastName}</p>
              <p><strong>Email:</strong> {lecturer.email}</p>
              <p><strong>Degree:</strong> {lecturer.degree || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assigned Modules</CardTitle>
            </CardHeader>
            <CardContent>
              {modules.length > 0 ? (
                <ul className="list-disc pl-5">
                  {modules.map(module => (
                    <li key={module.moduleId}>
                      {module.name} (Credits: {module.numberOfCredits || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No modules assigned.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;