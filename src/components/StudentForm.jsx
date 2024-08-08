import React, { useState } from 'react';
import { firestore, auth } from '../clients/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import FingerprintCapture from './FingerprintCapture';

const StudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    staffID: '', // This will be set by FingerprintCapture
    department: '',
    gender: '',
    picture: '',
    fingerprint: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFingerprintCapture = (staffID) => {
    setFormData({ ...formData, staffID });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.surname || !formData.firstName || !formData.middleName || !formData.staffID || !formData.department || !formData.gender || !formData.picture || !formData.fingerprint) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const formattedFormData = {
          ...formData,
          surname: formData.surname.charAt(0).toUpperCase() + formData.surname.slice(1),
          firstName: formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1),
          middleName: formData.middleName.charAt(0).toUpperCase() + formData.middleName.slice(1),
        };
        console.log('Submitting data:', formattedFormData);
        await setDoc(doc(firestore, "staffs", user.uid), formattedFormData);
        navigate('/dashboard/Staffs');
        setFormData({
          surname: '',
          firstName: '',
          middleName: '',
          staffID: '',
          department: '',
          gender: '',
          picture: '',
          fingerprint: ''
        });
      } else {
        alert('No user is signed in');
      }
    } catch (error) {
      console.error('Error saving staff details:', error);
      alert('Failed to save staff details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-gray-900 min-h-screen text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {/* Other form fields */}
        <div className="mb-4">
          <label className="block text-gray-400">Surname</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Gender</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-300">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                className="form-radio text-pink-600"
              />
              <span className="ml-2 text-gray-300">Female</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {formData.picture && (
            <img src={formData.picture} alt="Student" className="mt-2 w-20 h-20 border-2 border-gray-700 rounded" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Fingerprint</label>
          <FingerprintCapture onFingerprintCapture={handleFingerprintCapture} />
          {formData.fingerprint && (
            <div className="mt-2">
              <p className="text-gray-400">Fingerprint: {formData.fingerprint}</p>
            </div>
          )}
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
