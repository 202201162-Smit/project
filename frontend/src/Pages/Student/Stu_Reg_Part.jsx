import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import config from '../../config';

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

export const Stu_Reg = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when registration starts
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false); // Set loading state to false if passwords do not match
        return;
      }

      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responsedata = await response.json();

      if (response.ok) {
        toast.success(responsedata.message || 'Verification OTP email sent');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        console.log(responsedata);
        const userId = responsedata.data.userId;
        setTimeout(() => {
          navigate(`/otp/${userId}`);
        }, 2000);
      } else {
        toast.error(responsedata.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false after registration attempt
    }
  };

  useEffect(() => {
    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/deleteusers`);
        
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
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Aboard!</h2>
        <h3 className="text-lg text-center mb-2">Sign up to join the community</h3>
        <div className="overflow-y-auto max-h-[100vh] p-4 border rounded-lg bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-400">First Name *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-400">Last Name *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400">Email Address *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

                <div>
                <PasswordCriteria password={formData.password} />
                </div>
                <div className="flex space-x-2">
                <div className="flex-1">
                <label className="text-sm font-semibold text-gray-400">Create Password *</label>
                <div className="relative">
                  <input
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-400">Confirm Password *</label>
                <div className="relative">
                  <input
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              className={`w-full text-gray-800 p-3 rounded font-bold transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link className="text-green-500 hover:underline" to="/student-login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};