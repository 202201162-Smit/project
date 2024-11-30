import React from 'react'
import { useNavigate } from 'react-router-dom';

function Card(props) {

    const navigate = useNavigate();
    const handleImageClick = (id) => {
        navigate(`/event/${id}`);
    };
    const { event } = props;
    return (
        <div>
            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-95 transition transform duration-200">
                <img src={event.poster} alt={event.eventName} className="w-full h-[400px] object-cover" onClick={() => handleImageClick(event._id)} />
                <div className="p-3 bg-gray-200">
                    <h3 className="text-xl mb-2 text-black "> <strong>{event.eventName}</strong></h3>
                    <p className="text-sm text-gray-700">{event.venue}</p>
                </div>
            </div>
        </div>
    )
}

export default Card