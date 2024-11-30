import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';

export const Forgot_Pass_Stu = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success("Login Successful !!");
        const responsedata = await response.json();
        console.log(responsedata)
        const type = "user";
        storeTokenInLs(responsedata.token, responsedata.representative.name, responsedata.representative.id, type, responsedata.representative.image);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 401 || response.status === 403) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    // <div className="flex h-screen">
    //   <div className="w-3/5">
    //     <img src="back_login.jpg" alt="" className="w-full h-full object-cover" />
    //   </div>
    //   <div className="w-2/5 flex justify-center items-center">
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer/>
      <div className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        {/* <h3 className="text-lg text-center mb-4">Reset Your Password</h3> */}
        <p className="text-center mb-6">Enter Your Email Id & a valid password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400">Email Address *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="text"
              name="email"
              placeholder="Enter Your Email"
              value={user.email}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400">Enter New Password *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="password"
              name="password"
              placeholder="Your New Password"
              value={user.password}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <span className="text-center mt-4">
              <label className="text-sm font-semibold text-gray-400">Confirm Password * </label>
            </span>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="password"
              name="c-password"
              placeholder="Confirm Your New Password"
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex justify-center">
            <Link className="w-full" to="/student-login">
            <button
              className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition-colors"
              type="submit"
            >
              Submit
            </button></Link>
          </div>
        </form>
      </div>
    </div>
  );
};