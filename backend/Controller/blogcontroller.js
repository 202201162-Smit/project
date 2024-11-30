const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const Blog = require('../Models/Blog'); // Import Blog model
const { uploadOnCloudinary } = require("../config/cloudinary");
const {upload} = require("../middleware/multer")

const createBlog = async (req, res) => {
  
  upload(req, res, async(err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err });
    }
    
    try {
      const { title, content, date, college, clubId} = req.body;

      // Access uploaded files
      const uploadedFiles = req.files;

      const imageUrls = await Promise.all(
          uploadedFiles.map(async (file) => {
          const uploadResult = await uploadOnCloudinary(file.path, "/eventsphere/blog");
          return uploadResult ? uploadResult.url : null;
          })
      );
  
      //   // Create a new blog post and save it to the database
      const newBlog = new Blog({
          title,
          content,
          college,
          date,
          images: imageUrls,
          clubId: clubId,
      });
      await newBlog.save();
      res.status(201).json({
              message: 'Blog created successfully!',
              blog: newBlog,
            });
    } catch (error) {
      console.error(error);
        res.status(500).json({
          message: 'An error occurred while creating the blog',
          error: error.message,
        });
    }
  });
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
