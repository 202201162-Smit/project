import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Banner from "./Banner";
import EventCard from "./Event_Card";
import axios from 'axios';

export const Home = () => {
  // const [events, setEvents] = useState([]);

  //   useEffect(()=>{
  //       console.log("first")
  //       const getAllEvents = async () => {
  //           try {
  //               const results = await axios.get("http://localhost:3000/api/home/latestevent");
  //               console.log("results", results);
  //               setEvents(results.data.trendingEvents);
  //           } catch (error) {
  //               console.log(error);
  //           }
  //       }; 

  //       getAllEvents();
  //   },[]);

  //   useEffect(()=>{
  //     console.log("events", events);
  // },[events])

  return (
    <>
      <div className="bg-gray-900">
        <Navbar/>
        {/* <div className='h-[92px]'></div> */}
        <Banner/>
        <EventCard title="Trending Events"/>
        <EventCard title="Latest Event"/>
        <Footer />
      </div>
    </>
  );
}

