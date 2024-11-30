const Event = require("../Models/Event");

const temp=async (req,res)=> {

    // console.log("qrwe");

    try {
        const { selectedTags = [], selectedTypes = [], searchQuery = "" } = req.query;
    
        const query = {};
    
        // Convert stringified arrays back to actual arrays
        const parsedSelectedTags = selectedTags ? JSON.parse(selectedTags) : [];
        const parsedSelectedTypes = selectedTypes ? JSON.parse(selectedTypes) : [];
    
        // Use the parsed arrays in your query
        if (parsedSelectedTags.length) {
          query.tags = { $in: parsedSelectedTags };
        }
    
        if (parsedSelectedTypes.length) {
          query.type = { $in: parsedSelectedTypes };
        }
    
    
        // Filter by search query if provided
        if (searchQuery) {
          query.eventName = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
        }
    
        // console.log("Final Query:", query); // Log the final query to verify it's correct
        // Find events based on query
        const events = await Event.find(query);
    
        // Return the filtered events
        res.status(200).json({ events });
      } catch (error) {
        // console.error(error);
        console.log('sd');
        res.status(500).json({ message: "Error fetching events" });
      }
}

module.exports = {temp};