import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchStaffs, deleteStaff, updateStaff } from '../clients/Hooks';

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    staffID: '',
    department: '',
    gender: '',
    picture: '',
    fingerprint: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getStaffs = async () => {
      try {
        const staffsData = await fetchStaffs();
        setStaffs(staffsData);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };

    getStaffs();
  }, []);

  const viewStaff = (id) => {
    navigate(`/profile/${id}`);
  };

  const openModal = (staff) => {
    setCurrentStaff(staff);
    setFormData(staff);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStaff(null);
    setFormData({
      surname: '',
      firstName: '',
      middleName: '',
      staffID: '',
      faculty: '',
      department: '',
      gender: '',
      picture: '',
      fingerprint: ''
    });
  };

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

  const handleSave = async () => {
    try {
      await updateStaff(currentStaff.id, formData);
      setStaffs((prevStaffs) =>
        prevStaffs.map((staff) =>
          staff.id === currentStaff.id ? formData : staff
        )
      );
      closeModal();
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const confirmDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      try {
        await deleteStaff(id);
        setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex-none p-4 bg-gray-800 shadow flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Staffs</h2>
          <p className="text-gray-400">Manage staff records.</p>
        </div>
        <Link to="/dashboard/AddStaff">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Staff
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Staffs List */}
        <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 px-4">Surname</th>
                <th className="py-2 px-4 hidden lg:table-cell">First Name</th>
                <th className="py-2 px-4 hidden lg:table-cell">Middle Name</th>
                <th className="py-2 px-4">Staff ID</th>
                <th className="py-2 px-4 hidden lg:table-cell">Department</th>
                <th className="py-2 px-4 hidden lg:table-cell">Gender</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{staff.surname}</td>
                  <td className="py-2 px-4 hidden lg:table-cell">{staff.firstName}</td>
                  <td className="py-2 px-4 hidden lg:table-cell">{staff.middleName}</td>
                  <td className="py-2 px-4">{staff.staffID}</td>
                  <td className="py-2 px-4 hidden lg:table-cell">{staff.department}</td>
                  <td className="py-2 px-4 hidden lg:table-cell">{staff.gender}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => viewStaff(staff.id)}
                      className="text-blue-500 hover:underline mx-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openModal(staff)}
                      className="text-green-500 hover:underline mx-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(staff.id)}
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Staff</h2>
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
              <label className="block text-gray-400">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Faculty</label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
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
                <img src={formData.picture} alt="Staff" className="mt-2 w-20 h-20 border-2 border-gray-700 rounded" />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Fingerprint</label>
              <img
                src={formData.fingerprint || 'placeholder-image-url'}
                alt="Scanned Fingerprint"
                className="w-20 h-20 border-2 border-gray-700 rounded"
              />
            </div>
            <div className="mt-8">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
