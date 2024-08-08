import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AttendanceList from './components/AttendanceList';
import AttendanceRecord from './components/AttendanceReport';
import DefaultLayout from './components/Layout';
import StudentManagement from './components/Students';
import TakeAttendance from './components/TakeAttendance';
import StudentForm from './components/StudentForm';
import PrivateRoute from './clients/Authcontext/PrivateRoute';
import Registration from './components/Registration';
import Signup from './components/Signup';
import FingerprintCapture from './components/FingerprintCapture';

const App = () => {
  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path='/' element={<Registration />} />
          <Route path='login' element={<Signup /> } />
        <Route path="dashboard" element={<PrivateRoute element={<DefaultLayout />} />}>
            <Route index element={<Dashboard />} />
            <Route path="AttendanceList" element={<AttendanceList />} />
            <Route path="AttendanceRecord" element={<AttendanceRecord />} />
            <Route path="Staffs" element={<StudentManagement />} />
            <Route path="TakeAttendance" element={<TakeAttendance />} />
            <Route path="AddStaff" element={<StudentForm />} />
            <Route path="capture-fingerprint" element={<FingerprintCapture />} />
          </Route>
        </Routes>
      </div>
  );
};

export default App;
