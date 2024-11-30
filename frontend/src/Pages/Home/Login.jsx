import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const Login = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center  min-h-screen bg-gray-900 dark:bg-gray-900 p-6">
        {/* Container for the header section */}
        <div className="text-center space-y-6 mt-[150px]">
          <h1 className="text-6xl font-extrabold text-gray-300 dark:text-white drop-shadow-lg">
            Welcome to <span className="text-blue-500">EVENTSPHERE</span>
          </h1>
          <p className="text-2xl text-gray-300 dark:text-gray-300 max-w-2xl mx-auto">
            The ultimate platform for managing and participating in college events
          </p>
        </div>

        <hr className="w-3/4 my-8 border-t-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          <div className="flex flex-col justify-between items-center bg-black-800 h-full rounded-xl p-2">
            <p className="text-center text-lg text-white mb-4">
              If you're a student, log in here to explore some of the best College Events taking place. Take part and show the world what you are!! 
            </p>
            <Link
              to="/student-login"
              className="flex justify-center items-center px-10 py-4 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl"
            >
              Student Login
            </Link>
          </div>

          <div className="flex flex-col justify-between items-center bg-black-800 h-full rounded-xl p-2">
            <p className="text-lg text-center text-white mb-4">
              If you're representing a college, log in here to register and manage your College Events on our site. Get more partcipants and make your Event a blast!!
            </p>
            <Link
              to="/college-login"
              className="flex justify-center items-center px-10 py-4 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl"
            >
              College Login
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
    // <div>
    //   
    // </div>
  );
};
