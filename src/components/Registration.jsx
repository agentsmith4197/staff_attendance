import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import image from '../assets/images.jpeg';
import { auth, db, storage, createUserWithEmailAndPassword, setDoc, ref, uploadBytes, getDownloadURL, doc } from '../clients/firebase';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    email: '',
    profilePicture: '',
    password: '',
    confirmPassword: '',
  });

  const [profilePreview, setProfilePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Upload profile picture if provided
      let profilePictureUrl = '';
      if (formData.profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, formData.profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      // Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        surname: formData.surname,
        firstName: formData.firstName,
        middleName: formData.middleName,
        email: formData.email,
        profilePicture: profilePictureUrl,
      });

      console.log('User registered successfully:', user.uid);
      navigate('/dashboard'); // Navigate to dashboard after successful registration
    } catch (error) {
      console.error('Error registering user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side: Form Card */}
      <div className="lg:w-1/2 bg-gray-900 flex justify-center items-center overflow-hidden">
        <div className="p-8 sm:p-12 w-full max-w-md h-screen overflow-y-auto hide-scrollbar">
          <h2 className="text-3xl font-extrabold text-white mb-8">Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Surname */}
            <div className="mb-4">
              <label className="block text-gray-400">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                disabled={loading}
              />
            </div>
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-400">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                disabled={loading}
              />
            </div>
            {/* Middle Name */}
            <div className="mb-4">
              <label className="block text-gray-400">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                disabled={loading}
              />
            </div>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                disabled={loading}
              />
            </div>
            
            {/* Profile Picture */}
            <div className="mb-4">
              <label className="block text-gray-400">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                disabled={loading}
              />
              {profilePreview && (
                <div className="mt-4">
                  <img src={profilePreview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
                </div>
              )}
            </div>
            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-400">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Background Picture (hidden on small screens) */}
      <div className="lg:w-1/2 hidden lg:flex">
        <img
          src={image}
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default RegistrationForm;
