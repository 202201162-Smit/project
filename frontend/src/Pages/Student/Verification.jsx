import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Verification = () => {
  const navigate = useNavigate();

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/otp');
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <div className="w-full max-w-md px-10 py-8 bg-gray-800 text-white shadow-lg rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">Student Verification</h2>
          <h3 className="mt-2 text-gray-400">Please enter your college email ID</h3>
        </div>
        <form className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-400">Email Address *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400">Domain Name *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="text"
              placeholder="Enter domain name"
              required
            />
          </div>
          <div className="flex justify-between gap-4">
            <button
              className="w-1/2 bg-yellow-500 text-gray-800 p-2 rounded font-semibold hover:bg-yellow-600 transition duration-200"
              onClick={handleSubmit1}
            >
              Skip
            </button>
            <button
              className="w-1/2 bg-yellow-500 text-gray-800 p-2 rounded font-semibold hover:bg-yellow-600 transition duration-200"
              onClick={handleSubmit}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};