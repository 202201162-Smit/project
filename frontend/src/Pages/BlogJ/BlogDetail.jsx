import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import config from '../../config';

export const BlogDetail = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_API || "http://localhost:3000"}/api/blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to load the blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  const { title, content, college, date, images } = blog;

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
    <Navbar />
    <div className="flex justify-center bg-gray-900 mt-24">
    <div className=" max-w-screen-lg p-6">

      {/* Blog Title */}
      <h1 className="text-4xl  font-bold text-center mb-4 text-blue-400">{title}</h1>
      <div className="text-center text-sm text-blue-500 mb-8">
        <span>Published by {college}</span> | <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      {/* Image Slider */}
      {images && images.length > 0 && (
        <div className="relative mb-8">
          <img
            src={images[currentImageIndex]}
            alt={`Blog Image ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full"
          >
            &#8592;
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full"
          >
            &#8594;
          </button>
        </div>
      )}

      {/* Blog Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg leading-relaxed text-gray-700">{content}</p>
      </div>

    </div>
    </div>
    <Footer />
    </>
  );
};

export default BlogDetail;