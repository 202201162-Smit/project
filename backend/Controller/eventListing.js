const cloudinary = require('../config/cloudinary');
const Event = require('../Models/Event');
const User = require('../Models/User');
const { uploadOnCloudinary } = require("../config/cloudinary");
const { upload2 } = require("../middleware/multer");
// const { get } = require('mongoose');

exports.getParticipants = async (req, res) => {
  try {
    // console.log("Participants page", req.params.eventId)
    const participants = await Event.findOne({ _id: req.params.eventId }).populate({
      path: 'registrations', // Populate 'registrations' array
      populate: {
        path: 'additionalDetails', // For each user, populate 'additionalDetails'
        model: 'UserProfile', // Specify the model for nested population
      },
    });

    // console.log("Participants", participants)
    // participants.registrations.populate('additionalDetails')

    // console.log("Participants fetched")

    if (!participants) {
      return res
        .status(404)
        .json({ error: "Partcipant not found" });
    }
    console.log("Hyeyyy")
    res
      .status(200)
      .json({ participants });


  }
  catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve participants" });

  }
}

exports.createEvent = async (req, res) => {
  upload2(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err });
    }

    try {
      const {
        eventName,
        description,
        price,
        registrationStartDate,
        registrationEndDate,
        startTime,
        endTime,
        type,
        tags,
        createdBy,
        mode,
        venue,
        contactPersonEmail,
        contactPersonPhone,
        clubId,
      } = req.body;

      // Access uploaded poster file
      const posterFile = req.file;

      // Upload poster to Cloudinary and get URL
      let posterUrl = null;
      if (posterFile) {
        const uploadResult = await uploadOnCloudinary(posterFile.path, "/eventsphere/events");
        posterUrl = uploadResult ? uploadResult.url : null;
      }

      // Create a new event and save it to the database
      const newEvent = new Event({
        eventName,
        description,
        price,
        poster: posterUrl,
        listedAt: new Date(), // Default to current date if not provided
        registrationStartDate: new Date(registrationStartDate),
        registrationEndDate: new Date(registrationEndDate),
        startTime: startTime || getDefaultStartTime(), // Use default function if not provided
        endTime: endTime || getDefaultEndTime(),       // Use default function if not provided
        type,
        tags: JSON.parse(tags), // Ensure tags is parsed to array
        createdBy, // Assuming createdBy is a valid ObjectId reference to CollegeRep
        mode,
        venue,
        contactPersonEmail,
        contactPersonPhone,
        clubId,
      });

      await newEvent.save();

      res.status(200).json({
        message: 'Event created successfully!',
        event: newEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({
        message: 'An error occurred while creating the event',
        error: error.message,
      });
    }
  });
};

exports.updateEvent = async (req, res) => {
  upload2(req, res, async (err) => {
  try {
      // console.log("Edit carried out");
      const { eventId } = req.params;
      // console.log(req.body)
      const { tags, description, eventName, price, type, venue, createdBy, mode, registrationStartDate, registrationEndDate, startTime, endTime, contactPersonEmail, contactPersonPhone } = req.body;

      // Parse tags if sent as JSON string
      const parsedTags = tags ? JSON.parse(tags) : [];
      console.log("Description:", description, eventId, tags, description, eventName, price, type, venue, createdBy, mode, registrationStartDate, registrationEndDate, startTime, endTime, contactPersonEmail, contactPersonPhone);

      // Find the event to update and update fields
      const updatedEvent = await Event.findOneAndUpdate(
          { _id: eventId },
          {
              description: description,
              eventName: eventName,
              price: price,
              type: type,
              venue: venue,
              createdBy: createdBy,
              mode: mode,
              registrationStartDate: registrationStartDate,
              registrationEndDate: registrationEndDate,
              startTime: startTime,
              endTime: endTime,
              contactPersonEmail: contactPersonEmail,
              contactPersonPhone: contactPersonPhone,
              tags: parsedTags
          },
          { new: true } // Return the updated document
      );

      // console.log("Updated Event:", updatedEvent);
      if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json({
          message: "Event updated successfully",
          event: updatedEvent,
      });
  } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error });
  }
})
};

exports.getcontests = async (req, res) => {
  try {
    const concerts = await Event.find({ type: "Concert" }, 'poster');
    res.status(200).json(concerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch concert events" });
  }
}
exports.getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Helper functions for default times
const getDefaultStartTime = () => {
  const now = new Date();
  now.setHours(9, 0, 0, 0); // Default start time at 9:00 AM
  return now;
};

const getDefaultEndTime = () => {
  const now = new Date();
  now.setHours(17, 0, 0, 0); // Default end time at 5:00 PM
  return now;
};

