import React, { useState } from 'react';

const FingerprintCapture = ({ onFingerprintCapture }) => {
  const [staffID, setStaffID] = useState('');

  const handleCapture = () => {
    if (staffID.trim()) {
      onFingerprintCapture(staffID.trim()); // Pass the staff ID to the parent component
    }
  };

  const handleInputChange = (e) => {
    setStaffID(e.target.value);
  };

  return (
    <div className="space-y-8 p-8 bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Fingerprint Capture</h2>
        <div className="mb-4">
          <label className="block text-gray-400">Staff ID</label>
          <input
            type="text"
            value={staffID}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={handleCapture}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
};

export default FingerprintCapture;
