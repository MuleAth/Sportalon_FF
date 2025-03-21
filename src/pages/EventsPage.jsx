import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/getevent");
        const data = await response.json();

        if (data.success) {
          setEvents(
            data.events.map((event) => {
              const applyLastDate = new Date(event.applyLastDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison

              return {
                id: event._id,
                title: event.title,
                description: event.description,
                date: `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`,
                registrationDeadline: applyLastDate.toLocaleDateString(),
                location: event.location,
                image: "https://tiemdelhi.com/blogs/wp-content/uploads/2023/03/sports-1024x683.jpg",
                status: applyLastDate >= today, // Check if applyLastDate is today or in the future
              };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 mt-4">
          <div className="text-left ">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Sports Events
            </h1>
            <p className="text-xl text-gray-600">
              Discover and register for upcoming sports events
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Event Status Based on Registration Deadline */}
                <span
                  className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    event.status ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {event.status ? "Available" : "Closed"}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Deadline: {event.registrationDeadline}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${
                  "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
