import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import Banner from "../Home/Banner.jsx";
import axios from "axios";
import Card from "../../components/Card.jsx";
import Cookies from "js-cookie"
const type = Cookies.get("type");
import config from "../../config.js";

export const Events_Page = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const tagDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);

    useEffect(() => {
        const getAllEvents = async () => {
            try {
                // Pass selected tags, types, and search query as query params
                const results = await axios.get(`${config.BACKEND_API || "http://localhost:3000"}/api/asd`, {
                    params: {
                        selectedTags: JSON.stringify(selectedTags), // Convert array to string
                        selectedTypes: JSON.stringify(selectedTypes), // Convert array to string
                        searchQuery: searchQuery
                    }
                });
                setFilteredEvents(results.data.events); // Initialize filteredEvents with all events
            } catch (error) {
                console.log(error);
            }
        };

        getAllEvents();
    }, [selectedTags, selectedTypes, searchQuery]); // Trigger the API call when filters change

    const tags = [
        "Coding", "Workshop", "Career Fair", "Cultural Festival", "Music", "Theater",
        "Orientation", "Party", "Club Fair", "Resume Building", "Networking", "Leadership",
        "Intramural", "Fitness", "Tournament", "Social Justice", "Mental Health",
        "Diversity", "Game Night", "Trivia", "Talent Show"
    ].map(tag => ({ label: tag }));

    const types = [{ label: "Competition" }, { label: "Concert" }, { label: "Other" }];

    const toggleSelection = (setSelected, selectedArray, option) => {
        if (selectedArray.includes(option)) {
            setSelected(selectedArray.filter(item => item !== option));
        } else {
            setSelected([...selectedArray, option]);
        }
    };

    const clearAllFilters = () => {
        setSelectedTags([]);
        setSelectedTypes([]);
        setSearchQuery("");
    };

    const filterEvents = () => {
        const filtered = events.filter(event => {
            const matchesTag = selectedTags.length
                ? event.tags.some(tag => selectedTags.includes(tag))
                : true;
            const matchesType = selectedTypes.length
                ? selectedTypes.includes(event.type)
                : true;
            const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTag && matchesType && matchesSearch;
        });
        setFilteredEvents(filtered);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tagDropdownRef.current && !tagDropdownRef.current.contains(event.target) &&
                typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)
            ) {
                setIsTagOpen(false);
                setIsTypeOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <Banner />

            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold">Filters</h2>
                </div>

                <div className="flex space-x-4 mb-8">
                    {/* Tags Filter */}
                    <div className="relative" ref={tagDropdownRef}>
                        <button
                            onClick={() => setIsTagOpen(!isTagOpen)}
                            className="text-left px-4 py-2 w-[250px] bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                        >
                            Tags
                        </button>
                        {isTagOpen && (
                            <div className="absolute mt-2 w-full bg-black text-white rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                                <div className="px-4 py-2 space-y-2">
                                    {tags.map(tag => (
                                        <label
                                            key={tag.label}
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag.label)}
                                                onChange={() => {
                                                    toggleSelection(setSelectedTags, selectedTags, tag.label);
                                                }}
                                                className="form-checkbox h-4 w-4 text-yellow-500"
                                            />
                                            <span className="text-sm">{tag.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Types Filter */}
                    <div className="relative" ref={typeDropdownRef}>
                        <button
                            onClick={() => setIsTypeOpen(!isTypeOpen)}
                            className="text-left px-4 py-2 w-[250px] bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                        >
                            Types
                        </button>
                        {isTypeOpen && (
                            <div className="absolute mt-2 w-full bg-black text-white rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                                <div className="px-4 py-2 space-y-2">
                                    {types.map(type => (
                                        <label
                                            key={type.label}
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type.label)}
                                                onChange={() => {
                                                    toggleSelection(setSelectedTypes, selectedTypes, type.label);
                                                }}
                                                className="form-checkbox h-4 w-4 text-yellow-500"
                                            />
                                            <span className="text-sm">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Clear All Filters
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-4">
                    <label className="w-[515px] px-3 py-2 border rounded-md flex items-center gap-2 bg-gray-700 text-white">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="text-left w-full h-full px-4 py-2 border-none bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Search by event name"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-4 h-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </label>
                    {type === "club" && <Link
                        to="/listing/0"
                        className="bg-blue-600 text-white px-5 py-3 rounded-md shadow-md ml-4 hover:bg-blue-700"
                    >
                        List Event
                    </Link>}
                </div>
            </section>

            {/* Events Section */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredEvents.map((event) => (
                        <div key={event.id}>
                            <Card event={event} />
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};
