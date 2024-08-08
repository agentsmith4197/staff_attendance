import React from "react";
import { FaChalkboardTeacher, FaClipboardList, FaUserGraduate, FaFingerprint } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { MdExitToApp } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { auth } from '../clients/firebase';

const Sidebar = () => {
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const linkClass = (path) => 
    `text-lg flex items-center rounded px-4 py-3 transition-all ${
      location.pathname === path
        ? "bg-[#4A90E2] text-white"
        : "text-gray-400 hover:bg-[#6A5EFF] hover:text-white"
    }`;

  return (
    <>
      <nav className="bg-[#0A0A1F] p-5 h-full md:flex flex-col min-w-[250px] hidden md:block">
        <div className="font-kanit font-bold text-2xl mb-10">
          <h1 className="text-[#6A5EFF]">Staff Attendance</h1>
        </div>

        <ul className="space-y-7 font-amiko flex-1">
          <li>
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              <IoIosHome className="w-[18px] h-[18px] mr-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/AttendanceList" className={linkClass("/dashboard/AttendanceList")}>
              <FaClipboardList className="w-[18px] h-[18px] mr-4" />
              <span>Attendance List</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/AttendanceRecord" className={linkClass("/dashboard/AttendanceRecord")}>
              <FaChalkboardTeacher className="w-[18px] h-[18px] mr-4" />
              <span>Attendance Report</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/Staffs" className={linkClass("/dashboard/Staffs")}>
              <FaUserGraduate className="w-[18px] h-[18px] mr-4" />
              <span>Staffs</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/TakeAttendance" className={linkClass("/dashboard/TakeAttendance")}>
              <FaFingerprint className="w-[18px] h-[18px] mr-4" />
              <span>Take Attendance</span>
            </Link>
          </li>
        </ul>

        <div className="mt-6">
          <li
            onClick={handleSignOut}
            className="text-gray-400 cursor-pointer text-sm flex items-center hover:bg-[#6A5EFF] hover:text-white rounded px-4 py-3 transition-all">
            <MdExitToApp className="w-[18px] h-[18px] mr-4" />
            <span>Logout</span>
          </li>
        </div>
      </nav>

      <nav className="bg-[#0A0A1F] p-3 fixed bottom-0 w-full md:hidden z-50 flex justify-around items-center">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <IoIosHome className="w-[18px] h-[18px] mb-1" />
        </Link>
        <Link to="/dashboard/AttendanceList" className={linkClass("/dashboard/AttendanceList")}>
          <FaClipboardList className="w-[18px] h-[18px] mb-1" />
        </Link>
        <Link to="/dashboard/AttendanceRecord" className={linkClass("/dashboard/AttendanceRecord")}>
          <FaChalkboardTeacher className="w-[18px] h-[18px] mb-1" />
        </Link>
        <Link to="/dashboard/Staffs" className={linkClass("/dashboard/Staffs")}>
          <FaUserGraduate className="w-[18px] h-[18px] mb-1" />
        </Link>
        <Link to="/dashboard/TakeAttendance" className={linkClass("/dashboard/TakeAttendance")}>
          <FaFingerprint className="w-[18px] h-[18px] mb-1" />
        </Link>
      </nav>
    </>
  );
};

export default Sidebar;
