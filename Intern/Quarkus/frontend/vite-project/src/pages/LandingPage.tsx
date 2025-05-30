import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Student Management System</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Empowering education with seamless management of students, lecturers, courses, and attendance. Log in to access your dashboard or sign up as a lecturer.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-200">
              Student Login
            </Button>
          </Link>
          <Link to="/lecturer-signin">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Lecturer Sign-In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Manage Courses</h3>
            <p className="text-gray-600">
              Easily create, update, and track courses and their modules.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Track Attendance</h3>
            <p className="text-gray-600">
              Monitor student attendance for each lecture effortlessly.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Student Progress</h3>
            <p className="text-gray-600">
              View enrollment and progress details for every student.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 Student Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;