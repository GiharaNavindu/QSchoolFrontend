// import { Button } from "@/components/ui/button";
// import * as React from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { Link } from "react-router-dom";

// const features = [
//   "Manage Courses with Ease",
//   "Track Attendance Instantly",
//   "Monitor Student Progress",
//   "Connect with Lecturers",
//   "Analyze Academic Data",
//   "Streamlined Admin Workflow",
//   "Secure and Scalable System",
//   "24/7 Support and Updates",
//   "Personalized Dashboards",
//   "Multidevice Accessibility",
// ];

// const LandingPage: React.FC = () => {
//   const [time, setTime] = React.useState(new Date());
//   const [date, setDate] = React.useState(new Date());

//   React.useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const getRotationStyle = (angle: number) => ({
//     transform: `rotate(${angle}deg)`,
//     transformOrigin: "50% 100%", // Pivot at the bottom center of the hand
//   });

//   return (
//     <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col">
//       {/* Hero Section */}
//       <section className="flex-1 flex flex-col justify-center items-center text-center py-20 bg-gradient-to-r from-blue-50 to-white">
//         <h1 className="text-5xl font-bold mb-6 text-[#1E3A8A]">
//           Shape the Future with Smart Student Management
//         </h1>
//         <p className="text-xl mb-10 max-w-3xl text-[#374151]">
//           Streamline your academic journey — track students, connect with
//           lecturers, manage courses, and monitor attendance effortlessly.
//         </p>

//         <div className="space-x-4">
//           <Link to="/login">
//             <Button
//               size="lg"
//               className="bg-[#1E3A8A] text-white hover:bg-[#1D4ED8] transition"
//             >
//               Student Login
//             </Button>
//           </Link>
//           <Link to="/lecturer-signin">
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition"
//             >
//               Lecturer Sign-In
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Clock & Calendar Section */}
//       <section className="py-14 bg-white flex flex-col md:flex-row justify-around items-center gap-10 shadow-inner">
//         {/* Wall Clock */}
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
//             Wall Clock
//           </h2>
//           <div className="w-40 h-40 rounded-full border-4 border-blue-700 relative flex items-center justify-center bg-white shadow-lg">
//             {/* Hour Markers */}
//             {[...Array(12)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-1 h-2 bg-blue-700"
//                 style={{
//                   transform: `rotate(${i * 30}deg) translateY(-70px)`,
//                   transformOrigin: "center center",
//                 }}
//               />
//             ))}
//             {/* Hour Hand */}
//             <div
//               className="absolute w-2 h-12 bg-blue-800 rounded"
//               style={{
//                 ...getRotationStyle(
//                   (time.getHours() % 12) * 30 + time.getMinutes() * 0.5
//                 ),
//                 bottom: "50%", // Anchor bottom to clock center
//                 transform: `translateY(50%) rotate(${
//                   (time.getHours() % 12) * 30 + time.getMinutes() * 0.5
//                 }deg)`, // Combine translation and rotation
//               }}
//             />
//             {/* Minute Hand */}
//             <div
//               className="absolute w-1.5 h-16 bg-blue-500 rounded"
//               style={{
//                 ...getRotationStyle(time.getMinutes() * 6),
//                 bottom: "50%", // Anchor bottom to clock center
//                 transform: `translateY(50%) rotate(${time.getMinutes() * 6}deg)`, // Combine translation and rotation
//               }}
//             />
//             {/* Second Hand */}
//             <div
//               className="absolute w-1 h-18 bg-red-500 rounded"
//               style={{
//                 ...getRotationStyle(time.getSeconds() * 6),
//                 bottom: "50%", // Anchor bottom to clock center
//                 transform: `translateY(50%) rotate(${time.getSeconds() * 6}deg)`, // Combine translation and rotation
//               }}
//             />
//             {/* Center Dot */}
//             <div className="absolute w-4 h-4 bg-black rounded-full z-10" />
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
//             Calendar
//           </h2>
//           <Calendar
//             onChange={setDate}
//             value={date}
//             className="rounded-md shadow-md p-4"
//           />
//         </div>
//       </section>

//       {/* Features Section with Infinite Scroll */}
//       <section className="py-16 bg-[#F9FAFB]">
//         <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
//           System Highlights
//         </h2>
//         <div className="max-w-4xl mx-auto h-64 overflow-y-scroll border p-6 rounded-lg bg-white shadow-md space-y-4 scroll-smooth">
//           {Array.from({ length: 20 }).map((_, i) => (
//             <div key={i} className="p-4 border-b text-lg text-[#374151]">
//               {features[i % features.length]}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-6 bg-[#0F172A] text-white text-center">
//         <p>© 2025 Student Management System. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Users,
  CheckCircle,
  BookOpen,
  MessageSquare,
  BarChart,
  Workflow,
  Shield,
  Headphones,
  LayoutDashboard,
  Smartphone,
  Calendar as CalendarIcon,
  FileText,
} from "lucide-react";

const features = [
  {
    title: "Manage Courses with Ease",
    description: "Organize and update courses effortlessly with our intuitive platform.",
    icon: BookOpen,
  },
  {
    title: "Track Attendance Instantly",
    description: "Real-time attendance tracking with automated reports.",
    icon: CheckCircle,
  },
  {
    title: "Monitor Student Progress",
    description: "Monitor academic performance with detailed insights.",
    icon: BarChart,
  },
  {
    title: "Parent Portal Access",
    description: "Enable parents to stay connected with student progress.",
    icon: Users,
  },
  {
    title: "Online Gradebook",
    description: "Manage and share grades securely with students and parents.",
    icon: FileText,
  },
  {
    title: "Fee Management System",
    description: "Simplify fee collection and financial tracking.",
    icon: Workflow,
  },
  {
    title: "Connect with Lecturers",
    description: "Facilitate seamless communication between students and faculty.",
    icon: MessageSquare,
  },
  {
    title: "Analyze Academic Data",
    description: "Gain insights with powerful data analytics tools.",
    icon: BarChart,
  },
  {
    title: "Streamlined Admin Workflow",
    description: "Automate administrative tasks for efficiency.",
    icon: Workflow,
  },
  {
    title: "Secure and Scalable System",
    description: "Ensure data security with a robust, scalable platform.",
    icon: Shield,
  },
  {
    title: "24/7 Support and Updates",
    description: "Access round-the-clock support and regular updates.",
    icon: Headphones,
  },
  {
    title: "Personalized Dashboards",
    description: "Customize dashboards for students, teachers, and admins.",
    icon: LayoutDashboard,
  },
  {
    title: "Multidevice Accessibility",
    description: "Access the system from any device, anywhere.",
    icon: Smartphone,
  },
  {
    title: "Timetable Management",
    description: "Create and share class schedules effortlessly.",
    icon: CalendarIcon,
  },
  {
    title: "Assignment Tracking",
    description: "Assign, track, and grade assignments online.",
    icon: FileText,
  },
];

const notices = [
  "School reopens on June 10, 2025",
  "Parent-Teacher Meeting scheduled for June 15, 2025",
  "Annual Sports Day postponed to July 2025",
];

const events = [
  { title: "Parent-Teacher Meeting", date: "June 15, 2025", time: "10:00 AM" },
  { title: "Sports Day", date: "July 20, 2025", time: "8:00 AM" },
  { title: "Mid-Term Exams", date: "August 1-5, 2025", time: "9:00 AM" },
];

const LandingPage: React.FC = () => {
  const [time, setTime] = React.useState(new Date());
  const [date, setDate] = React.useState(new Date());
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  // Animation variants for feature cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-20 bg-gradient-to-r from-blue-50 to-white">
        <h1 className="text-5xl font-bold mb-6 text-[#1E3A8A]">
          Shape the Future with Smart School Management
        </h1>
        <p className="text-xl mb-10 max-w-3xl text-[#374151]">
          Empower your school with seamless student tracking, parent engagement,
          and efficient course management.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-[#1E3A8A] text-white hover:bg-[#1D4ED8] transition"
            >
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

      {/* About the School Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1E3A8A]">
            About Our School
          </h2>
          <p className="text-lg text-[#374151] max-w-3xl mx-auto">
            Founded in 1985, our school is dedicated to fostering academic
            excellence and personal growth. With a commitment to innovation and
            inclusivity, our core values of integrity, respect, and collaboration
            guide us in shaping future leaders.
          </p>
        </div>
      </section>

      {/* Clock & Calendar Section */}
      <section className="py-14 bg-[#F9FAFB] flex flex-col md:flex-row justify-around items-center gap-10 shadow-inner">
        {/* Digital Clock */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
            Digital Clock
          </h2>
          <Card className="w-40 p-4 bg-white shadow-lg">
            <CardContent>
              <p className="text-2xl font-mono text-[#1E3A8A]">
                {formatTime(time)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
            Calendar
          </h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="rounded-md shadow-md p-4"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
          System Highlights
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                className="shadow-lg hover:scale-105 transition-transform duration-300 border-[#1E3A8A]/20 hover:border-[#1E3A8A] bg-white"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <feature.icon className="h-8 w-8 text-[#1E3A8A]" />
                    <CardTitle className="text-lg text-[#1E3A8A]">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#374151]">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Photo/Video Carousel */}
      <section className="py-16 bg-[#F3F4F6]">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
          Life at Our School
        </h2>
        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="flex animate-scroll">
            {[
              "https://via.placeholder.com/600x400?text=School+Campus",
              "https://via.placeholder.com/600x400?text=Classroom+Activities",
              "https://via.placeholder.com/600x400?text=Sports+Day",
              "https://via.placeholder.com/600x400?text=Student+Achievements",
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`School Activity ${index + 1}`}
                className="w-96 h-64 object-cover rounded-lg mx-2"
              />
            ))}
          </div>
        </div>
        <style jsx>{`
          .animate-scroll {
            display: flex;
            animation: scroll 20s linear infinite;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
          Our Achievements
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-[#1E3A8A]">1500+</p>
              <p className="text-[#374151]">Students Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-[#1E3A8A]">80+</p>
              <p className="text-[#374151]">Teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-[#1E3A8A]">50+</p>
              <p className="text-[#374151]">Classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-[#1E3A8A]">100+</p>
              <p className="text-[#374151]">Awards Won</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Notices & Upcoming Events Section */}
      <section className="py-16 bg-[#F9FAFB] flex flex-col md:flex-row max-w-5xl mx-auto gap-10">
        {/* Notices */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
            Notices & Announcements
          </h2>
          <ScrollArea className="h-64 border p-6 rounded-lg bg-white shadow-md">
            {notices.map((notice, index) => (
              <div key={index} className="p-4 border-b text-lg text-[#374151]">
                {notice}
              </div>
            ))}
          </ScrollArea>
        </div>
        {/* Upcoming Events */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
            Upcoming Events
          </h2>
          <ScrollArea className="h-64 border p-6 rounded-lg bg-white shadow-md">
            {events.map((event, index) => (
              <div key={index} className="p-4 border-b text-lg text-[#374151]">
                <p className="font-semibold">{event.title}</p>
                <p>{event.date} at {event.time}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">
          Get in Touch
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info & Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#1E3A8A]" />
                <p>123 School Lane, Education City, EC 12345</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#1E3A8A]" />
                <p>(123) 456-7890</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-[#1E3A8A]" />
                <p>info@school.edu</p>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-6 w-6 text-[#1E3A8A] hover:text-[#1D4ED8]" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-6 w-6 text-[#1E3A8A] hover:text-[#1D4ED8]" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-6 w-6 text-[#1E3A8A] hover:text-[#1D4ED8]" />
                </a>
              </div>
            </CardContent>
          </Card>
          {/* Newsletter Signup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Newsletter Signup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#1E3A8A] text-white hover:bg-[#1D4ED8]"
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Google Map */}
        <div className="max-w-5xl mx-auto mt-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019536513508!2d-122.4194155846813!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5c2b2b7b%3A0x7a0d6f7b9b0b0b0b!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1634567890123"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="School Location"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#0F172A] text-white text-center">
        <p>© 2025 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;