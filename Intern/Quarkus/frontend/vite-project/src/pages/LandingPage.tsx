import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const features = [
  "Manage Courses with Ease",
  "Track Attendance Instantly",
  "Monitor Student Progress",
  "Connect with Lecturers",
  "Analyze Academic Data",
  "Streamlined Admin Workflow",
  "Secure and Scalable System",
  "24/7 Support and Updates",
  "Personalized Dashboards",
  "Multidevice Accessibility",
];

const LandingPage: React.FC = () => {
  const [time, setTime] = React.useState(new Date());
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRotationStyle = (angle: number) => ({
    transform: `rotate(${angle}deg)`,
    transformOrigin: 'bottom center',
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-20 bg-gradient-to-r from-blue-50 to-white">
        <h1 className="text-5xl font-bold mb-6 text-[#1E3A8A]">
          Shape the Future with Smart Student Management
        </h1>
        <p className="text-xl mb-10 max-w-3xl text-[#374151]">
          Streamline your academic journey — track students, connect with lecturers,
          manage courses, and monitor attendance effortlessly.
        </p>

        <div className="space-x-4">
          <Link to="/login">
            <Button size="lg" className="bg-[#1E3A8A] text-white hover:bg-[#1D4ED8] transition">
              Student Login
            </Button>
          </Link>
          <Link to="/lecturer-signin">
            <Button
              size="lg"
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
            >
              Lecturer Sign-In
            </Button>
          </Link>
        </div>
      </section>

      {/* Clock & Calendar Section */}
      <section className="py-14 bg-white flex flex-col md:flex-row justify-around items-center gap-10 shadow-inner">
        {/* Wall Clock */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">Wall Clock</h2>
          <div className="w-40 h-40 rounded-full border-4 border-blue-700 relative flex items-center justify-center bg-white shadow-lg">
            {/* Hour Hand */}
            <div
              className="absolute w-1 h-10 bg-blue-800"
              style={getRotationStyle((time.getHours() % 12) * 30 + time.getMinutes() * 0.5)}
            />
            {/* Minute Hand */}
            <div
              className="absolute w-1 h-16 bg-blue-500"
              style={getRotationStyle(time.getMinutes() * 6)}
            />
            {/* Second Hand */}
            <div
              className="absolute w-0.5 h-20 bg-red-500"
              style={getRotationStyle(time.getSeconds() * 6)}
            />
            {/* Center dot */}
            <div className="absolute w-3 h-3 bg-black rounded-full z-10" />
          </div>
        </div>

        {/* Calendar */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="rounded-md shadow-md p-4"
          />
        </div>
      </section>

      {/* Features Section with Infinite Scroll */}
      <section className="py-16 bg-[#F9FAFB]">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">System Highlights</h2>
        <div className="max-w-4xl mx-auto h-64 overflow-y-scroll border p-6 rounded-lg bg-white shadow-md space-y-4 scroll-smooth">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-4 border-b text-lg text-[#374151]">
              {features[i % features.length]}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#0F172A] text-white text-center">
        <p>&copy; 2025 Student Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
