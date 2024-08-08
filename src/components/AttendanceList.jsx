import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { fetchAttendanceRecords, deleteAttendanceRecord } from '../clients/Hooks';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const getAttendanceRecords = async () => {
      const records = await fetchAttendanceRecords();
      setAttendanceRecords(records.flatMap(record => record.attendanceData));
    };

    getAttendanceRecords();
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return 'Invalid Date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return parsedDate.toLocaleDateString(undefined, options);
  };

  const formatTime = (time) => {
    const parsedTime = new Date(`1970-01-01T${time}`);
    if (isNaN(parsedTime)) return 'Invalid Time';
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return parsedTime.toLocaleTimeString(undefined, options);
  };

  const statusClass = (status) => {
    return classNames({
      'text-green-500': status === 'Present',
      'text-red-500': status === 'Absent',
    });
  };

  const deleteRecord = async (id) => {
    await deleteAttendanceRecord(id);
    setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen min-w-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-400">View and manage attendance records here.</p>
      </div>

      {/* Attendance Records */}
      <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-3 px-4">Staff Name</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3 px-4">{record.staffName}</td>
                <td className="py-3 px-4">{formatDate(record.date)}</td>
                <td className="py-3 px-4">{formatTime(record.time)}</td>
                <td className={`py-3 px-4 ${statusClass(record.status)}`}>{record.status}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
