const express = require("express");
const router = express.Router();
// const mongoose=require('mongoose')
// const collRep=require('../Models/CollegeRep')
const RepController=require('../Controller/authCollegeRepProfile')

// router.get("/getid/:id",RepController.getCollegeRepById)
router.get('/:id',RepController.getCollegeRepById)
router.get("/events/:id",RepController.getEvents)
router.get("/blogs/:id",RepController.getBlogs)

router.delete("/delete/blogs/:id",RepController.deleteBlogs)
router.delete("/delete/:id",RepController.deleteEvent)

module.exports = router;