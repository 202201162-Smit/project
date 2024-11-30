import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';

export const Club_Otp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [code, setCode] = useState(['', '', '', '']);
  const { userId } = useParams();

  // console.log(userId);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    // Automatically focus on the next input
    if (value && index < code.length - 1) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join('');
    
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/college/club-verify`, {
        method: "POST",
        headers: {"Content-Type" : "application/json",},
        body: JSON.stringify({userId, otp}),
      })
      const data = await response.json();
      console.log(data);
      if (data.status === "VERIFIED") {
        toast.success(data.message || "Email verified successfully!");
        setTimeout(() => {
          navigate('/college-profile');
        }, 2000);
      } else {
        toast.error(data.message || "OTP verification failed");
        setTimeout(() => {
            navigate('/college-profile');
        }, 2000);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <ToastContainer/>
      <div className="p-6 bg-gray-800 text-white rounded-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify email</h2>
        <p className="mb-6">A verification code has been sent to you. Enter the code below</p>
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-2xl text-center rounded border border-gray-700 bg-gray-900 focus:outline-none focus:border-yellow-500"
            />
          ))}
        </div>
        <button onClick={handleSubmit} className="w-full py-3 bg-yellow-500 text-gray-800 font-semibold rounded hover:bg-yellow-600 transition duration-200">
          Verify email
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-4 text-sm flex justify-between">
          <button className="text-gray-400 hover:underline" onClick={() => navigate('/college-profile')}>← Back to Profile</button>
        </div>
      </div>
    </div>
  );
};