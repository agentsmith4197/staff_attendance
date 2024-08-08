import React, { useState } from 'react';
import { auth } from '../clients/firebase'; // Make sure the path is correct
import image from '../assets/images.jpeg';
import { useNavigate } from 'react-router-dom';
import {  signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('User signed in successfully');
      navigate('/dashboard');// Redirect to dashboard or another protected route
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid email or password. Please try again.');
    }
  };


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side (Form Card) */}
      <div className="md:w-1/2 bg-gray-900 text-white flex justify-center items-center">
        <div className="p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right Side (Background Image) */}
      <div
        className="md:w-1/2 hidden md:flex items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        <div className="relative z-10 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
