import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import config from "../../config.js";

export const Payment = () => {
  const { id } = useParams(); // Extract the event ID from the URL
  const [event, setEvent] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Credit Card");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

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

  const handleClick = async () => {
    try {
      console.log("H");
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/hi/${id}/${userId}`);
      console.log(response);
      const data = await response.json(); // Parse response body once
      if (response.ok) {

        const response2 = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/hi2/${id}/${userId}`);
        if (response2.ok) {
          toast.success("Registered Successfully!!");
        }
        else {
          toast.error("Payment Failed!!");

        }
        console.log("Y");
        setTimeout(() => {
          navigate(`/event/${id}`);
        }, 3000);
      } else {
        // Handle non-OK responses
        console.log("Error response:", data);
        toast.error(data.message || "Registration Unsuccessful");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err.message || "An unexpected error occurred");
    }
  };
  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="h-screen bg-black-600 text-yellow-300 flex justify-center items-center">
        {/* Glassy Box */}
        <div className="max-w-lg w-full bg-black bg-opacity-50 text-yellow-300 rounded-lg shadow-lg p-8 backdrop-blur-md relative">
          <h2 className="text-3xl font-bold mb-4 text-center">{event?.eventName || "Event Name"}</h2>
          <p className="text-center text-xl font-semibold mb-6">
            Amount: ${event?.price || "XX.XX"}
          </p>

          {/* Payment Method Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Payment Method</h3>
            <div className="flex flex-col items-center space-y-3">
              {["Credit Card", "PayPal", "Net Banking"].map((method) => (
                <label
                  key={method}
                  className="flex items-center bg-black bg-opacity-70 py-2 px-4 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all w-4/5"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    className="form-radio text-yellow-300 mr-3"
                    checked={selectedMethod === method}
                    onChange={() => setSelectedMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pay Now Button */}
          <div className="flex justify-center">
            <button
              className="bg-yellow-300 text-black py-3 px-8 rounded-lg shadow-md hover:bg-yellow-400 transition-all"
              onClick={handleClick}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
};
