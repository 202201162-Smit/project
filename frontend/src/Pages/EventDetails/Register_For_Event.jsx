import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie"
import config from "../../config.js";

export const Register_For_Event = () => {
  const { id } = useParams(); // Extract the event ID from the URL
  const [event, setEvent] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  const type = Cookies.get("type");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/${id}`); // Replace with your API URL
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  console.log(event);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      setIsFooterVisible(footerTop <= windowHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  const handleClick = async () => {
    try {
      console.log("H");
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/hi/${id}/${userId}`);
      console.log(response);
      const data = await response.json();
      if (response.ok) {
        if (data.diffCollege === true) {
          console.log("payment");
          navigate(`/payment/${id}`);
        } else {
          toast.success("Registered Successfully!!");
          console.log("Y");
          navigate(`/event/${id}`);
        }
      } else {
        console.log("Error response:", data);
        toast.error(data.message || "Registration Unsuccessful");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Navbar />
      <div className="h-[100px]"></div>
      <ToastContainer />

      <div className="flex flex-col items-center p-4 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-yellow-600 mt-5">{event.eventName}</h1>
        <div className="w-full max-w-3xl mx-auto">
          <img
            src={event.poster}
            alt={`Banner for ${event.eventName}`}
            className="w-full h-[300px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl mt-8">
        <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Event Description</h2>
        <div
          className="text-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-yellow-700">Event Mode & Venue</h3>
          <p className="mt-4 text-lg">Mode: <span className="font-semibold">{event.mode}</span></p>
          <p className="mt-2 text-lg">Venue: <span className="font-semibold">{event.venue}</span></p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-yellow-700">Registration Details</h3>
          <p className="mt-4 text-lg">
            Registration Starts:{" "}
            <span className="font-semibold">{new Date(event.registrationStartDate).toLocaleDateString()} - {event.startTime}</span>
          </p>
          <p className="mt-2 text-lg">
            Registration Ends:{" "}
            <span className="font-semibold">{new Date(event.registrationEndDate).toLocaleDateString()} - {event.endTime}</span>
          </p>
          <p className="mt-2 text-lg">
            Price: <span className="font-semibold">{event.price} INR</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl mt-8">
        <h3 className="text-2xl font-semibold text-yellow-700 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-3">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-yellow-200 text-yellow-700 text-sm px-4 py-2 rounded-full shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto gap-8 mt-8">
        {/* <div className="bg-yellow-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-yellow-700">Timings</h3>
          <p className="mt-4 text-lg">Start Time: <span className="font-semibold">{event.startTime}</span></p>
          <p className="mt-2 text-lg">End Time: <span className="font-semibold">{event.endTime}</span></p>
        </div> */}
        <div className="bg-yellow-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-yellow-700">Contacts</h3>
          <p className="mt-4 text-lg">
            Email: <span className="font-semibold">{event.contactPersonEmail}</span>
          </p>
          <p className="mt-2 text-lg">
            Phone Number: <span className="font-semibold">{event.contactPersonPhone}</span>
          </p>
        </div>
      </div>
      {type === "user" && (
        <div className="flex justify-center mt-5 mb-6">
        <button className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-400 transition-all"
        onClick={()=>handleClick()}>
          Register for Event
        </button>
      </div>
      )}

      <footer id="footer" className="mt-8">
        <Footer />
      </footer>
    </div>
  );
};
