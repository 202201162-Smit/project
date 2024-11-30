// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables
const fs = require("fs");


exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: "dggywuuhe",
            api_key: "325745837459845",
            api_secret: "Jsykss5EK86X6K0vTPbA8-eZR8s",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder:folder
        })
        // file has been uploaded successful
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

