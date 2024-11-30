// models/Blog.js
const mongoose = require('mongoose');
const CollegeRep = require("./CollegeRep")

// Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    college: {
      type: String, 
      required: true,
    },
    date:{
      type: Date,
      required: true,
    },
    images: [{ type: String }],
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeRep",
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt & updatedAt
);

module.exports = mongoose.model('Blog', blogSchema);
