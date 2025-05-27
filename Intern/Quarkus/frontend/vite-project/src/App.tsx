import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import StudentDetails from './pages/StudentDetails';
import { Student } from './types';
import StudentEnrollments from './pages/StudentEnrollment';
import LecturerDashboard from './pages/LecturerDasboard';
import LecturerStudents from './pages/LecturerStudents';
import LecturerCourses from './pages/LecturerCourses';


//-------------------------------------------------------------------------------Auth-------------------------------------
const App: React.FC = () => {
  const [role, setRole] = useState<string>('Lecturer'); 
  const [userId, setUserId] = useState<string>('LEC001'); 

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar role={role} userId={userId} />
        <div className="flex-1 bg-gray-100">
          <Routes>
            <Route path="/student/:userId" element={<StudentDashboard userId={userId} />} />
            <Route path="/student/:userId/details" element={<StudentDetails userId={userId} />} />
            <Route path="/student/:userId/enrollments" element={<StudentEnrollments userId={userId} />} />
            <Route path="/lecturer/:userId" element={<LecturerDashboard userId={userId} />} />
            <Route path="/lecturer/:userId/students" element={<LecturerStudents userId={userId} />} />
            <Route path="/lecturer/:userId/courses" element={<LecturerCourses userId={userId} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;