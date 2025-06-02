import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Link } from "react-router-dom";

// Icons
import {
  Book,
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

interface SidebarProps {
  role: string;
  userId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userId }) => {
  return (
    <div className="w-64 bg-[#1E3A8A] text-[#F3F4F6] h-screen p-4 shadow-lg">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          className="h-20 w-20 mb-2 rounded-full shadow"
          alt="Logo"
        />
        <h2 className="text-2xl font-bold tracking-wide">SMS</h2>
      </div>

      {/* Navigation */}
      <nav>
        {role === "Student" ? (
          <ul>
            <li className="mb-2">
              <Link to={`/student/${userId}`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/student/${userId}/details`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <User size={18} />
                  Profile
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/student/${userId}/enrollments`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  Enrollments
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/student/${userId}/attendance`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <CalendarCheck size={18} />
                  Attendance
                </Button>
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/students`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <Users size={18} />
                  Students
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/courses`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <Book size={18} />
                  Courses
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link to={`/lecturer/${userId}/attendance`}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-[#F3F4F6] hover:bg-[#3346A3] flex items-center gap-2"
                >
                  <CalendarCheck size={18} />
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
