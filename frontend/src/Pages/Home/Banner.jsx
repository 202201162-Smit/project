import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/concerts`); // Replace with your API URL
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners', error);
      }
    };
    fetchBanners();
  }, []);

  // console.log(banners);

  useEffect(() => {
    if (isManual) {
      // Do not auto-slide when manually changing the banner
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Slide every 3 seconds

    // Cleanup the interval when the component is unmounted or paused
    return () => clearInterval(intervalId);
  }, [isManual]);

  // Function to go to the next slide
  const nextSlide = () => {
    setIsManual(true); // Mark as manual transition
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    
    // After 3 seconds, resume automatic sliding
    setTimeout(() => {
      setIsManual(false);
    }, 3000);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setIsManual(true); // Mark as manual transition
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);

    // After 3 seconds, resume automatic sliding
    setTimeout(() => {
      setIsManual(false);
    }, 3000);
  };

  const handleImageClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black-800 mr-8 ">
      {/* Slides */}
      <div
        className="flex transition-transform ease-in-out mt-[120px] duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {banners.map((banner, index) => (
          <div className="min-w-full box-border p-1" key={index}>
            <a href="#" className="link">
              <img
                src={banner.poster}
                alt={`Banner ${index + 1}`}
                className="w-full block rounded-xl h-[480px]"
                onClick={() => handleImageClick(banner._id)}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition duration-300"
      >
        &lt;
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition duration-300"
      >
        &gt;
      </button>
    </div>
  );
};

export default Banner;