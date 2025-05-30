import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const LandingPage: React.FC = () => {
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(new Date());

  // Clock update every second
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollItems = Array.from({ length: 20 }, (_, i) => ({
    title: `Feature ${i + 1}`,
    description: "This is a brief explanation of this feature."
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-100 to-white text-black py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Shape the Future with Smart Student Management</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Track students, connect with lecturers, manage courses, and monitor attendance effortlessly.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Student Login
            </Button>
          </Link>
          <Link to="/lecturer-signin">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Lecturer Sign-In
            </Button>
          </Link>
        </div>
      </section>

      {/* Clock & Calendar Section */}
      <section className="bg-white py-10 flex flex-col md:flex-row justify-around items-center gap-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Current Time</h2>
          <p className="text-4xl font-mono">{time.toLocaleTimeString()}</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Academic Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="rounded-md shadow-md"
          />
        </div>
      </section>

      {/* Infinite Scroll / Features Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="h-96 overflow-y-auto space-y-4 border p-4 rounded-md bg-white shadow-inner">
            {scrollItems.map((item, index) => (
              <div key={index} className="p-4 border-b">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
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
