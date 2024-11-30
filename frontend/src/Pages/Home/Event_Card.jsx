import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import config from '../../config';

const EventCard = ({ title }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const url = title === "Latest Event"
        ? `${config.BACKEND_API || "http://localhost:3000"}/api/home/latestevent`
        : `${config.BACKEND_API || "http://localhost:3000"}/api/home/trendingevent`;


        const results = await axios.get(url);
        
        const eventData = title === "Latest Event"
          ? results.data.latestevent
          : results.data.trendingEvents;

        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    getAllEvents();
  }, [title]);

  useEffect(() => {
    console.log("events", events);
  }, [events]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-semibold mt-12 mb-5 ml-2 text-left text-white">
        {title}
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {events?.map((event) => (
              <div key={event.id}>
                  <Card event={event} />
              </div>
          ))}
      </div>
  </section>
  );
};

export default EventCard;
