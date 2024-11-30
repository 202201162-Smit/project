import { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
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

export const Col_Reg = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailDomain: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when registration starts

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false); // Set loading state to false if passwords do not match
      return;
    }

    const dataToSubmit = {
      name: formData.collegeName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      emailDomain: formData.emailDomain,
    };

    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/college-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || 'Something went wrong');
        toast.error(responseData.message || 'Something went wrong');
      } else {
        toast.success(responseData.message || 'Verification OTP email sent');
        setError('');

        setFormData({
          collegeName: '',
          email: '',
          password: '',
          confirmPassword: '',
          emailDomain: '',
        });

        console.log(responseData);
        const userId = responseData.data.userId;
        setTimeout(() => {
          navigate(`/college-otp/${userId}`);
        }, 2000);
      }
    } catch (error) {
      console.log('Network error:', error);
    } finally {
      setLoading(false); // Set loading state to false after registration attempt
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
      <div className="w-[500px] bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-center mb-4">Join us</h2>
          <h3 className="text-lg text-center mb-2">Boost your events and make an impact!</h3>
        </div>

        <div className="overflow-y-auto max-h-[50vh] p-4 border rounded-lg bg-gray-800">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className="text-sm font-semibold text-gray-400">College Name *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                name="collegeName"
                placeholder="Enter Your College Name"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-400">College Email *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="email"
                name="email"
                placeholder="Enter Your College Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-400">Password *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="password"
                name="password"
                placeholder="Create a Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
            <PasswordCriteria password={formData.password} />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-400">Confirm Password *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4 flex justify-center">{error}</p>}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-400">Email Domain *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                name="emailDomain"
                placeholder="Enter Your College Email Domain"
                value={formData.emailDomain}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full text-white p-3 rounded font-bold transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-4">
          <h3>
            Already have an account? <a className="text-blue-500 hover:underline" href="/college-login">Log In</a>
          </h3>
        </div>
      </div>
    </div>
  );
};