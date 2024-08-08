import React, { useState, useEffect } from 'react';
import { fetchStaffs, fetchAttendanceStats, fetchRecentActivities, getCurrentUser } from '../clients/Hooks'; // Update import as necessary
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../clients/firebase';

const Dashboard = () => {
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        // Fetch current user
        const user = await getCurrentUser();
        if (user) {
          const userDoc = doc(firestore, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserName(userSnapshot.data().surname);
          }
        }

        // Fetch total students
        const staffs = await fetchStaffs();
        setTotalStaffs(staffs.length);

        // Fetch attendance statistics
        const attendanceStats = await fetchAttendanceStats();
        setPresentToday(attendanceStats.present);
        setAbsentToday(attendanceStats.absent);
        setAverageAttendance(attendanceStats.average);

        // Fetch recent activities
        const activities = await fetchRecentActivities();
        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    getDashboardData();
  }, []);

  return (
    <div className="space-y-8 p-8 bg-gray-900 min-h-screen text-white">
      {/* Welcome message */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Welcome, {userName}!</h2>
        <p className="text-gray-400">Here's a summary of your attendance system activity.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-700 cursor-pointer">
          <h3 className="text-xl font-semibold">Total Staffs</h3>
          <p className="text-3xl font-bold">{totalStaffs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-700 cursor-pointer">
          <h3 className="text-xl font-semibold">Present Today</h3>
          <p className="text-3xl font-bold">{presentToday}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-700 cursor-pointer">
          <h3 className="text-xl font-semibold">Absent Today</h3>
          <p className="text-3xl font-bold">{absentToday}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-700 cursor-pointer">
          <h3 className="text-xl font-semibold">Average Attendance</h3>
          <p className="text-3xl font-bold">{averageAttendance}%</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
        <ul className="space-y-4">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-center">
              <div className={`${activity.color} h-8 w-8 rounded-full flex items-center justify-center`}>
                <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                </svg>
              </div>
              <p className="ml-4 text-gray-300">{activity.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
