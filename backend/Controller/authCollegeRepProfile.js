const express = require('express')
const event=require('../Models/Event')
const CollegeRepModel=require('../Models/CollegeRep')
const college=require('../Models/College')
const eventModel=require('../Models/Event')
const Blog = require("../Models/Blog")

exports.getCollegeRepById = async (req, res) => {
    try {
        const collegeRep = await CollegeRepModel.findOne({_id:req.params.id}).populate('collegeId');
        if (!collegeRep) {
            return res
            .status(404)
            .json({ error: "College representative is not found" });
        }
        res
        .status(200)
        .json(collegeRep);
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to retrieve college representative information" });
    }
};

exports.getBlogs=async(req,res)=>{
    try {
        // console.log("to get blog")
        const blogs = await Blog.find({clubId:req.params.id});
        // console.log("got the blog")
        
        if (!blogs) {
            return res
            .status(200)
            .json({ message: "Blogs is not found" ,isBlog:false});
        }
        res
        .status(200)
        .json(blogs);
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to retrieve Blogs information" });
    }
}

exports.deleteBlogs=async(req,res)=>{
    try {
        // console.log("blogggg")
        const deletedBlog = await Blog.deleteOne({_id:req.params.id});
        // console.log("blog deleted")
        
        
        res
        .status(200)
        .json({ok:true})
        
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to retrieve Blogs information" });
    }
}


exports.getEvents = async (req, res) => {

    try{
        const events=await event.find({clubId:req.params.id})
        if (!events) {
            return res.status(404).json({ error: "Event not",events });
        }
        res.status(200).json({events});
    }catch(err){
        res
        .status(500)
        .json({ error: "Failed to retrieve events" });
    }
            
   
};

exports.deleteEvent = async (req, res) => {
    try {

        const deletedEvent=await eventModel.deleteOne({_id:req.params.id})
        
        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res
        .status(200)
        .json({ message: "Event deleted successfully" ,res:"ok"});
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to delete event" });
    }
};