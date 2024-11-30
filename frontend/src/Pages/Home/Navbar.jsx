import React, { useEffect, useState } from "react";
import { UserIcon, PowerIcon} from '@heroicons/react/24/solid';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import Cookies from "js-cookie"

const Navbar = () => {
  const { isLoggedIn} = useAuth();
  const name = Cookies.get("name");
  const image = Cookies.get("image");
  const type = Cookies.get("type");
  const userId = Cookies.get("userId");
  const { isCollegeRepresentative } = useAuth();
  const [userData, setUserData] = useState(null);

  const [sticky, setSticky] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   const fetchUserById = async () => {
  //     try {
  //       const response = await fetch(http://localhost:3000/api/users/${userId});
  //       const data = await response.json();

  //       setUserData(data.data);

  //     } catch (error) {
  //       toast.error('Error fetching user data');
  //     }
  //   };
  //   if (userId) {
  //     fetchUserById();
  //   }
  // }, [userId]);

  const navItems = (
    <>
      <li>
        <Link to="/" className="text-yellow-500 hover:text-yellow-200">Home</Link>
      </li>
      <li>
        <Link to="/events-page" className="text-yellow-500 hover:text-yellow-200">Events</Link>
      </li>
      <li>
        <Link to="/blogs" className="text-yellow-500 hover:text-yellow-200">Blogs</Link>
      </li>
      <li>
        <a className="text-yellow-500 hover:text-yellow-200">About</a>
      </li>

    </>
  );

  return (
    <>
      <div
        className={`max-w-screen-2xl container mx-auto md:px-6 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${sticky
          ? "sticky-navbar bg-gray-900/50 backdrop-blur-md text-white"
          : "bg-gray-800 text-white"
          }`}
      >
        <div className="navbar py-4">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {navItems}
              </ul>
            </div>
            <Link className="text-2xl font-bold cursor-pointer text-yellow-500" to="/">
              Event Sphere
            </Link>
          </div>
          <div className="navbar-end space-x-6">
            <div className="navbar-center lg:flex">
              <ul className="menu menu-horizontal mr-4 space-x-6 font-medium">
                {navItems}
              </ul>
            </div>
            <div className="hidden md:block">
            </div>

            {isLoggedIn ? (
              <div className="relative">

                <div className="flex rounded-full items-center space-x-2 h-20">
                  <Link to={`/profile/${userId}`}>
                    <img
                      src={image || "https://via.placeholder.com/80"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full shadow-md"
                    />
                  </Link>


                  <span className="ml-2 text-lg font-medium text-yellow-500">{`Hi! ${name}`}</span>
                  <div className="group relative">
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => {
                            if (type === "college") {
                              window.location.href = "/college-profile";
                            } else if (type === "club") {
                              window.location.href = "/club-profile";
                            } else {
                              window.location.href = "/student-profile";
                            }
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-yellow-500 flex"
                        >
                          <UserIcon className="h-6 w-6 text-gray-500 mr-1" />
                          View Profile
                        </button>
                      <button
                        onClick={() => navigate("/logout")}
                        className="block w-full text-left px-4 py-2 hover:bg-yellow-500 flex"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="bg-yellow-500 text-black px-3 py-2 ml-2 rounded-md hover:bg-yellow-600 duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;