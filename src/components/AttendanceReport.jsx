import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { fetchAttendanceRecords } from '../clients/Hooks';

const AttendanceRecord = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const getAttendanceRecords = async () => {
      const records = await fetchAttendanceRecords();
      setAttendanceRecords(records);
      filterRecordsByDate(records, selectedDate);
    };

    getAttendanceRecords();
  }, []);

  useEffect(() => {
    filterRecordsByDate(attendanceRecords, selectedDate);
  }, [selectedDate, attendanceRecords]);

  const filterRecordsByDate = (records, date) => {
    setFilteredRecords(records.filter(record => record.date === date));
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const statusClass = (status) => {
    return classNames({
      'text-green-500': status === 'Present',
      'text-red-500': status === 'Absent',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex-none p-4 bg-gray-800 shadow">
        {/* <h2 className="text-3xl font-bold">Attendance Records</h2> */}
        <p className="text-gray-400">View and manage attendance records.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Date Filter */}
        <div className="flex-none p-4 bg-gray-700 shadow mb-4">
          <label htmlFor="date" className="block text-gray-400 mb-2">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
        </div>

        {/* Attendance Records List */}
        <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 px-4">Staff Name</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{record.staffName}</td>
                  <td className="py-2 px-4">{formatDate(record.date)}</td>
                  <td className="py-2 px-4">
                    <span className={statusClass(record.status)}>
                      {record.status}
                    </span>
                  </td>
                  {/* <td className="py-2 px-4">
                    <button onClick={() => editRecord(record.id)} className="text-green-500 hover:underline mx-2">Edit</button>
                    <button onClick={() => deleteRecord(record.id)} className="text-red-500 hover:underline">Delete</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;
