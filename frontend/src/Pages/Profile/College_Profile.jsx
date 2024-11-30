import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';
import { useAuth } from '../../Context/AuthProvider';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'At most 30 characters', regex: /^.{0,30}$/ },
    { label: 'A number', regex: /\d/ },
    { label: 'A lowercase letter', regex: /[a-z]/ },
    { label: 'An uppercase letter', regex: /[A-Z]/ },
    { label: 'A special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  return (
    <div className="text-sm text-gray-400 mb-2">
      <p className="font-semibold text-gray-400">Password must contain:</p>
      <ul className="list-disc list-inside">
        {criteria.map((criterion, index) => (
          <li key={index} className={criterion.regex.test(password) ? 'text-green-500' : 'text-white-900'}>
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};


export const CollegeProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [collegeData, setCollegeData] = useState(null);
  const image = Cookies.get("image");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollegeById = async () => {
      try {
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/college/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setCollegeData(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error('Error fetching user data');
      }
    };
    if (userId) {
      fetchCollegeById();
    }
  }, [userId]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const [formData, setFormData] = useState({
    clubName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeId: userId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when club addition starts

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false); // Set loading state to false if passwords do not match
      return;
    }
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/college/club-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responsedata = await response.json();

      if (response.ok) {
        toast.success(responsedata.message || 'Verification OTP email sent');
        setFormData({
          clubName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        const userId = responsedata.data.userId;
        setTimeout(() => {
          navigate(`/club-otp/${userId}`);
        }, 2000);
      } else {
        toast.error(responsedata.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false after club addition attempt
    }
  };

  const handleDeleteProfile = async () => {
    try {
      console.log(userId);
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/college/delete/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("User deleted successfully");
        navigate("/logout");
      } else {
        toast.error("Error deleting profile");
      }
    } catch (error) {
      toast.error("Error deleting profile");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            {/* Profile Header */}
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={image || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-500">{collegeData?.name || ''}</h3>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <h4 className="text-lg font-semibold text-yellow-500 mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">College name</p>
                  <p className="text-gray-200">{collegeData?.name || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email address</p>
                  <p className="text-gray-200">{collegeData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Domain</p>
                  <p className="text-gray-200">{collegeData?.emailDomain || ''}</p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto relative border border-gray-700 rounded-lg p-4 bg-gray-800">
              <h4 className="text-lg font-semibold text-yellow-500 mb-2">Clubs and Committees</h4>
              <div className='overflow-y-auto max-h-[40vh] p-4 border-none rounded-lg bg-gray-800'>
                <ul className="list-none pl-0 space-y-4">
                  {collegeData?.collegeRepresentatives.length > 0 ? (
                    collegeData.collegeRepresentatives.map((club) => (
                      <li key={club._id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg text-gray-400">{club.clubName}</span>
                          <span className="text-sm text-gray-400">{club.email}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="bg-gray-700 p-4 rounded-lg shadow-lg text-center text-gray-400">
                      No clubs available
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'add-club':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <ToastContainer />
            <div className="text-center mb-10">
              <h4 className="text-2xl font-semibold text-yellow-500">Add a Club or Committee</h4>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-400">Club Name *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  name="clubName"
                  placeholder="Enter club name"
                  value={formData.clubName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400">Club email *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  type="email"
                  name="email"
                  placeholder="Enter club email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <PasswordCriteria password={formData.password} />
                </div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-400">Password *</label>
                  <input
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-400">Confirm Password *</label>
                  <input
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  type="submit"
                  className={`flex items-center px-4 py-2 w-full text-white rounded-md shadow-md transition duration-200 ease-in-out justify-center ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                  disabled={loading}
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg font-bold">{loading ? 'Adding Club...' : 'Add'}</span>
                </button>
              </div>
            </form>
          </div>
        );
      case 'delete':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-red-500 mb-4">Delete Account</h4>
            <p className="text-gray-200">Deleting your account is permanent and cannot be undone.</p>
            <button onClick={handleDeleteProfile} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-md flex">
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Account
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center top-24 w-full min-h-screen bg-gray-900 pb-24">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8 mt-28">
        <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Account</h2>

        <div className="flex">
          <aside className="w-1/4 space-y-6 pr-4 border-r border-gray-700">
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'profile' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'add-club' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('add-club')}
            >
              Add Club
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'delete' ? 'text-red-500 bg-gray-700' : 'text-gray-300 hover:bg-red-600'}`}
              onClick={() => setActiveSection('delete')}
            >
              Delete Account
            </button>
          </aside>

          <main className="w-3/4 bg-gray-900 rounded-lg shadow-inner p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};