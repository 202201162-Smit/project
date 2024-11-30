// Import Mongoose 
const mongoose = require('mongoose');
const CollegeRep = require("./CollegeRep")

// Helper functions for default start and end times
function getDefaultStartTime() {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Round to the nearest hour
    now.setHours(now.getHours() + 1); // Set to the next full hour
    return now.toTimeString().slice(0, 5); // Format as "HH:MM"
}

function getDefaultEndTime() {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 3); // Default to 3 hours from the next hour
    return start.toTimeString().slice(0, 5); // Format as "HH:MM"
}

// Define the Event schema
const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
        default: 0
    },

    poster: {
        type: String,
    },

    listedAt: {
        type: Date,
        required: true,
    },

    registrationStartDate: {
        type: Date,
        required: true,
    },

    registrationEndDate: {
        type: Date,
        required: true,
    },

    startTime: {
        type: String,  
        default: getDefaultStartTime,  // Default start time set to the next hour
    },

    endTime: {
        type: String,  
        default: getDefaultEndTime,  // Default end time set to 3 hours after start
    },

    type: {
        type: String,
        enum: ["Competition", "Concert", "Other"],
        required: true,
    },

    tags: [{
        type: String
    }],
       
    createdBy: {
        type: String,
        required: true,
    },
       
    registrations: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    mode: {
        type: String,
        enum: ['Online', 'Offline'], 
        required: true
    },

    venue: {
        type: String,
        required: function() { return this.mode === 'offline'; }, // Required only if mode is 'offline'
    },

    contactPersonEmail:{
        type: String,
        required: true,
    },
    contactPersonPhone: {
        type: String,
        required: true,
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollegeRep"
    },
});

module.exports = mongoose.model("Event", eventSchema);