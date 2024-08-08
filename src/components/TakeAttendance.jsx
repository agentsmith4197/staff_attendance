import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { fetchStaffs } from '../clients/Hooks';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../clients/firebase';

const TakeAttendance = () => {
  const [staffs, setStaffs] = useState([]);
  const [staffID, setStaffID] = useState('');
  const [scannedStaffID, setScannedStaffID] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getStaffs = async () => {
      const staffsData = await fetchStaffs();
      setStaffs(staffsData);
    };

    getStaffs();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setError('');
    setTimeout(() => {
      if (staffID) {
        setScannedStaffID(staffID);
      } else {
        setError('Staff ID is required.');
      }
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    if (scannedStaffID) {
      const matchedStaff = staffs.find(
        staff => staff.staffID === scannedStaffID
      );

      if (matchedStaff) {
        confirmAttendance(matchedStaff);
      } else {
        setError('Staff not found.');
      }
      setStaffID('');
      setScannedStaffID('');
    }
  }, [scannedStaffID, staffs]);

  const confirmAttendance = async (staff) => {
    try {
      const staffRef = doc(firestore, 'staffs', staff.id);
      await updateDoc(staffRef, {
        status: 'Present',
        attendanceDate: new Date().toISOString(),
      });

      setStaffs(prevStaffs =>
        prevStaffs.map(s =>
          s.id === staff.id ? { ...s, status: 'Present', attendanceDate: new Date().toISOString() } : s
        )
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError('Failed to update attendance.');
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceCollection = collection(firestore, 'attendance');
      const attendanceData = staffs.map(staff => ({
        staffName: `${staff.surname}, ${staff.firstName} ${staff.middleName}`,
        staffId: staff.id,
        status: staff.status || 'Absent',
        date: new Date().toISOString().split('T')[0], // Save date separately
        time: new Date().toISOString().split('T')[1], // Save time separately
      }));

      await addDoc(attendanceCollection, { attendanceData });

      await Promise.all(
        staffs.map(async staff => {
          if (staff.status === 'Pending') {
            await confirmAttendance(staff);
          }
        })
      );

      setStaffs([]);
      setStaffID('');
      setError('');
    } catch (error) {
      console.error('Error saving attendance:', error);
      setError('Failed to save attendance.');
    }
  };

  const statusClass = status => {
    return classNames({
      'text-gray-500': status === 'Pending',
      'text-green-500': status === 'Present',
      'text-red-500': status === 'Absent',
    });
  };

  return (
    <div className="space-y-8 p-8 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Take Attendance</h2>
          <p className="text-gray-400">Enter the Staff ID to confirm attendance.</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div>
          <button
            onClick={handleScan}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700"
            disabled={isScanning}
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </div>
      {/* Staff ID Input */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <input
          type="text"
          value={staffID}
          onChange={e => setStaffID(e.target.value)}
          placeholder="Enter Staff ID"
          className="p-2 w-full rounded bg-gray-700 text-white border border-gray-600"
        />
      </div>
      {/* Staff List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-3 px-4">Staff Name</th>
              <th className="py-3 px-4">Picture</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map(staff => (
              <tr key={staff.id} className="border-b border-gray-700">
                <td className="py-3 px-4">
                  {staff.surname}, {staff.firstName} {staff.middleName}
                </td>
                <td className="py-3 px-4">
                  <img src={staff.profilePicture} alt="Staff" className="w-10 h-10 rounded-full" />
                </td>
                <td className={`py-3 px-4 ${statusClass(staff.status)}`}>
                  {staff.status || 'Pending'}
                </td>
                <td className="py-3 px-4">
                  {staff.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => confirmAttendance(staff)}
                        className="text-green-500 hover:underline mx-2"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => confirmAttendance(staff)}
                        className="text-red-500 hover:underline mx-2"
                      >
                        Absent
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <button
          onClick={handleSaveAttendance}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default TakeAttendance;
