import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LecturerAttendance from "./pages/LecturerAttendance";
import LecturerCourses from "./pages/LecturerCourses";
import LecturerDashboard from "./pages/LecturerDasboard";
import LecturerStudents from "./pages/LecturerStudents";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDetails from "./pages/StudentDetails";
import StudentEnrollments from "./pages/StudentEnrollment";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [role, setRole] = useState<string>("Lecturer"); // or "lecturer"
  const [userId, setUserId] = useState<string>("LEC001");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar role={role} userId={userId} />
          <div className="flex-1 bg-gray-100">
            <Routes>
              <Route
                path="/student/:userId"
                element={<StudentDashboard userId={userId} />}
              />
              <Route
                path="/student/:userId/details"
                element={<StudentDetails userId={userId} />}
              />
              <Route
                path="/student/:userId/enrollments"
                element={<StudentEnrollments userId={userId} />}
              />
              <Route
                path="/lecturer/:userId"
                element={<LecturerDashboard userId={userId} />}
              />
              <Route
                path="/lecturer/:userId/students"
                element={<LecturerStudents userId={userId} />}
              />
              <Route
                path="/lecturer/:userId/courses"
                element={<LecturerCourses userId={userId} />}
              />
              <Route
                path="/lecturer/:userId/attendance"
                element={<LecturerAttendance userId={userId} />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;
