import { Button } from "@/components/ui/button";
import * as React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  role: string;
  userId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userId }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Student Management</h2>
      <nav>
        {role === "Student" ? (
          <ul>
            <li className="mb-2">
              <Link to={`/student/${userId}`}>
                <Button variant="ghost" className="w-full text-left">
                  Dashboard
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/student/${userId}/details`}>
                <Button variant="ghost" className="w-full text-left">
                  Profile
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/student/${userId}/enrollments`}>
                <Button variant="ghost" className="w-full text-left">
                  Enrollments
                </Button>
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}`}>
                <Button variant="ghost" className="w-full text-left">
                  Dashboard
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/students`}>
                <Button variant="ghost" className="w-full text-left">
                  Students
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/courses`}>
                <Button variant="ghost" className="w-full text-left">
                  Courses
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/attendance`}>
                <Button variant="ghost" className="w-full text-left">
                  Attendance
                </Button>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
