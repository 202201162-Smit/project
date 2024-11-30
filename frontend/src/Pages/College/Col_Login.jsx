import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from "axios"
import config from '../../config';

export const Col_Login = () => {
  const [collegeRep, setCollegeRep] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCollegeRep({ ...collegeRep, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when login starts
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/college-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collegeRep),
      });
      if (response.ok) {
        toast.success("Login Successful !!");
        const responseData = await response.json();
        const type = responseData.representative?.club ? 'club' : 'college';
        Cookies.set("token", responseData.token, { expires: 7 });
        Cookies.set("name", responseData.representative?.club || responseData.representative?.college, { expires: 7 });
        Cookies.set("userId", responseData.representative.id, { expires: 7 });
        Cookies.set("type", type, { expires: 7 });
        Cookies.set("image", `https://api.dicebear.com/5.x/initials/svg?seed=${responseData.representative?.club || responseData.representative?.college}`, { expires: 7 });
        storeTokenInLs(responseData.token, responseData.representative?.club || responseData.representative?.college, responseData.representative.id, type);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 401 || response.status === 403) {
        toast.error("Invalid Credentials");
      } else if (response.status === 404) {
        toast.error("Email does not exist!");
      }
    } catch (error) {
      console.error("Error during login", error);
    } finally {
      setLoading(false); // Set loading state to false after login attempt
    }
  };

  useEffect(() => {
    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${config.BACKEND_API || "http://localhost:3000"}/api/college/deletecolleges`);
        
      } catch (error) {
        toast.error("Error deleting profile");
      }
    };
    handleDelete();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer />
      <div className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <h3 className="text-lg text-center mb-4">Login to your Account</h3>
        <p className="text-center mb-6">It's nice to see you again. Ready to conquer?</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400">Email Address *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="email"
              name="email"
              placeholder="Your Work email"
              value={collegeRep.email}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400">Password * </label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="password"
              name="password"
              placeholder="Your Password"
              value={collegeRep.password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className={`w-full text-white p-3 rounded font-bold transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link className="text-blue-500 hover:underline" to="/college-register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};