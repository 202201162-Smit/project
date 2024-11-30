import React from 'react';
import { Link } from 'react-router-dom';

export const Common_Card = ({ role, className }) => {
  const isCollege = role === 'college';
  const heading = isCollege ? 'College Access' : 'Student Access';
  const loginPath = isCollege ? '/college-login' : '/login';
  const registerPath = isCollege ? '/college-register' : '/register';

  return (
    <div className={`flex flex-col justify-center items-center p-12 ${className}`}>
      <h2 className="mb-6 text-3xl font-bold text-white">{heading}</h2>
      <div className="flex space-x-4">
        <Link to={loginPath} className="py-3 px-6 bg-white text-blue-500 font-semibold rounded shadow hover:bg-gray-100">
          Login
        </Link>
        <Link to={registerPath} className="py-3 px-6 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600">
          Register
        </Link>
      </div>
    </div>
  );
};

