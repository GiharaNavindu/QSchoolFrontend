import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import LecturerAttendance from "./pages/LecturerAttendance";
import LecturerCourses from "./pages/LecturerCourses";
import LecturerDashboard from "./pages/LecturerDasboard";
import LecturerStudents from "./pages/LecturerStudents";
import StudentAttendance from "./pages/StudentAttendance";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDetails from "./pages/StudentDetails";
import StudentEnrollments from "./pages/StudentEnrollment";

const queryClient = new QueryClient(); //querclient is the client that will be used to fetch data from the server

const AppContent: React.FC = () => {
  const [role, setRole] = useState<string>("Lecturer");
  const [userId, setUserId] = useState<string>("LEC001");
  const location = useLocation();
  const hideSideBarRoutes = ["/"]; // Define routes where the sidebar should not be shown
  const shouldSideBar = !hideSideBarRoutes.includes(location.pathname); // Determine if the sidebar should be shown based on the current route

  return (
    <div className="flex min-h-screen">
      {shouldSideBar && <Sidebar role={role} userId={userId} />}
      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/student/:userId"
            element={<StudentDashboard userId={userId} />}
          />
          <Route
            path="/student/:userId/details"
            element={<StudentDetails userId={userId} />}
          />
          <Route
            path="/student/:userId/attendance"
            element={<StudentAttendance userId={userId} />}
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
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;
