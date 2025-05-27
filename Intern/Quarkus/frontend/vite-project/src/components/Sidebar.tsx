import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  role: string;
  userId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userId }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">{role} Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
              <Link to={`/${role.toLowerCase()}/${userId}`}>Dashboard</Link>
            </Button>
          </li>
          {role === 'Student' && (
            <>
              <li>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
                  <Link to={`/student/${userId}/details`}>My Details</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
                  <Link to={`/student/${userId}/enrollments`}>My Enrollments</Link>
                </Button>
              </li>
               <li>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
                  <Link to={`/student/${userId}/modules`}>Modules</Link>
                </Button>
              </li>
            </>
          )}
          {role === 'Lecturer' && (
            <>
              <li>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
                  <Link to={`/lecturer/${userId}/students`}>Students</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-gray-300">
                  <Link to={`/lecturer/${userId}/courses`}>Courses</Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;