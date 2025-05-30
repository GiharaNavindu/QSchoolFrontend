import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Enrollment {
  enrollmentId: number;
  courseId: string;
  course: { name: string };
}

interface Module {
  moduleId: string;
  name: string;
}

interface Lecture {
  lectureId: number;
  moduleId: string;
  module: { name: string };
  venue: string;
  time: string;
}

interface AttendanceData {
  moduleId: string;
  moduleName: string;
  attendedLectures: number;
  totalLectures: number;
}

interface StudentAttendanceProps {
  userId: string;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ userId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedLecture, setSelectedLecture] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/enroll/student/${userId}`);
        setEnrollments(response.data);
      } catch (err) {
        setError("Failed to fetch enrollments.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [userId]);

  // Fetch modules when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchModules = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/api/module/course?courseId=${selectedCourse}`);
          setModules(response.data);
          setSelectedModule("");
          setLectures([]);
          setSelectedLecture("");
          setAttendanceData([]);
        } catch (err) {
          setError("Failed to fetch modules.");
        } finally {
          setLoading(false);
        }
      };
      fetchModules();
    }
  }, [selectedCourse]);

  // Fetch lectures when a module is selected
  useEffect(() => {
    if (selectedModule) {
      const fetchLectures = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/api/lecture?filterModule=${selectedModule}`);
          setLectures(response.data.data);
          setSelectedLecture("");
          setAttendanceData([]);
        } catch (err) {
          setError("Failed to fetch lectures.");
        } finally {
          setLoading(false);
        }
      };
      fetchLectures();
    }
  }, [selectedModule]);

  // Fetch attendance when a lecture is selected
  useEffect(() => {
    if (selectedLecture) {
      const fetchAttendance = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/api/attendance/student/${userId}`);
          setAttendanceData(response.data);
        } catch (err) {
          setError("Failed to fetch attendance data.");
        } finally {
          setLoading(false);
        }
      };
      fetchAttendance();
    }
  }, [selectedLecture]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loader2 className="animate-spin" />}
          {error && <p className="text-red-500">{error}</p>}
          
          {/* Course Selection */}
          <div className="mb-4">
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
                    {enrollment.course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Module Selection */}
          {selectedCourse && (
            <div className="mb-4">
              <Select onValueChange={setSelectedModule} value={selectedModule}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.moduleId} value={module.moduleId}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Lecture Selection */}
          {selectedModule && (
            <div className="mb-4">
              <Select onValueChange={setSelectedLecture} value={selectedLecture}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Lecture" />
                </SelectTrigger>
                <SelectContent>
                  {lectures.map((lecture) => (
                    <SelectItem key={lecture.lectureId} value={String(lecture.lectureId)}>
                      {lecture.module.name} - {lecture.venue} ({new Date(lecture.time).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Attendance Table */}
          {selectedLecture && attendanceData.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Attended Lectures</TableHead>
                  <TableHead>Total Lectures</TableHead>
                  <TableHead>Attendance Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData
                  .filter((data) => data.moduleId === selectedModule)
                  .map((data) => (
                    <TableRow key={data.moduleId}>
                      <TableCell>{data.moduleName}</TableCell>
                      <TableCell>{data.attendedLectures}</TableCell>
                      <TableCell>{data.totalLectures}</TableCell>
                      <TableCell>
                        {((data.attendedLectures / data.totalLectures) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;