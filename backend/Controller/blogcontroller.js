const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const Blog = require('../Models/Blog'); // Import Blog model
const {uploadOnCloudinary} = require("../config/cloudinary");
// const { upload } = require("../middleware/multer")

const createBlog = async (req, res) => {
  try {
    const { title, content, date, college, clubId } = req.body;

    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Validate required fields
    if (!title || !content || !college || !clubId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Access uploaded file
    const uploadedFile = req.files?.image?.[0];
    if (!uploadedFile) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadOnCloudinary(uploadedFile.buffer, "image");
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    // Create a new blog post and save to database
    const newBlog = new Blog({
      title,
      content,
      college,
      date,
      images: [uploadResult.secure_url],
      clubId,
    });
    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully!",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({
      message: "An error occurred while creating the blog",
      error: error.message,
    });
  }
};

// Function to get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('clubId'); // Retrieve all blog posts
    // console.log(`${blogs}`);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// Function to get a single blog by its ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the blog' });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
};
