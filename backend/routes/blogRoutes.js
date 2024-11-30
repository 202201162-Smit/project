const express = require('express');
const multer = require('multer');
const Blog = require('../Models/Blog');
const blogController = require('../Controller/blogcontroller');
const { upload } = require("../middleware/multer"); 
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/suggestions', async (req, res) => {
  const query = req.query.q ? req.query.q.trim() : '';

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const suggestions = await Blog.find(
      { title: { $regex: new RegExp(query, 'i') } } // Use RegExp for better query handling
    ).select('title college'); // Only return 'title' and 'college' fields

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Blog creation route - only accessible by colleges
router.post("/create", blogController.createBlog);

// Get all blogs (public access)
router.get('/', blogController.getBlogs);  

// Get a single blog by its ID (public access)
router.get('/:id', blogController.getBlogById); 

// Handle errors related to file upload or server issues
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
  next();
});


module.exports = router;