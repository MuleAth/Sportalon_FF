import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

function Events() {
  const navigate = useNavigate();
  const id = useSelector((state) => state.auth.id);
  const email = useSelector((state) => state.auth.email);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    applyLastDate: "", // New field
    location: "",
    organizer: "",
    contact: "",
    coordinator_name: "", // New field
    coordinator_no: "", // New field
    description: "",
    rules: "",
    prizes: "",
    sportsCategory: "",
  });

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error("Error fetching events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create payload with dummy _id (replace with actual user id as needed)
      const payload = { ...formData, _id: id, createdBy: email };

      const response = await fetch("http://localhost:5000/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        console.log("Event created:", data.event);
        // Refresh events list after creating a new event
        fetchEvents();
        // Close the form and reset formData
        setShowForm(false);
        setFormData({
          title: "",
          startDate: "",
          endDate: "",
          applyLastDate: "", // Reset new field
          location: "",
          organizer: "",
          contact: "",
          coordinator_name: "", // Reset new field
          coordinator_no: "", // Reset new field
          description: "",
          rules: "",
          prizes: "",
          sportsCategory: "",
        });
      } else {
        console.error("Error creating event:", data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // New function to handle deletion of an event
  const handleDelete = async (eventId) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/events/${eventId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        // Remove the deleted event from the state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } else {
        console.error("Error deleting event:", data.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  return (
    <div className="content-area">
      <h1 className="page-title">Events Management</h1>

      <div className="mb-6">
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Create New Event
        </button>
      </div>

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Create New Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input-search"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input-search"
                    required
                  />
                </div>
              </div>

              {/* Last Date to Apply */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  name="applyLastDate"
                  value={formData.applyLastDate}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Sports Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sports Category
                </label>
                <input
                  type="text"
                  name="sportsCategory"
                  value={formData.sportsCategory}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organizer
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-search"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rules
                </label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  className="input-search"
                  rows="3"
                  required
                  placeholder="Enter each rule on a new line"
                ></textarea>
              </div>

              {/* Prizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prizes
                </label>
                <textarea
                  name="prizes"
                  value={formData.prizes}
                  onChange={handleInputChange}
                  className="input-search"
                  rows="3"
                  required
                  placeholder="Enter prize details"
                ></textarea>
              </div>

              {/* Coordinator Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Coordinator Name
                </label>
                <input
                  type="text"
                  name="coordinator_name"
                  value={formData.coordinator_name}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Coordinator Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Coordinator Mobile Number
                </label>
                <input
                  type="text"
                  name="coordinator_no"
                  value={formData.coordinator_no}
                  onChange={handleInputChange}
                  className="input-search"
                  required
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-6">
        {events.map((event) => (
          <div
            key={event._id} // Mongoose returns _id for documents
            className="card hover:shadow-lg cursor-pointer transition-shadow relative"
            onClick={() => handleEventClick(event._id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(event.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Participants:</span>{" "}
                    {event.participants ? event.participants.length : 0}
                  </p>
                </div>
              </div>
              {/* <span className="text-blue-600 dark:text-blue-400">→</span> */}
            </div>
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card's click event
                handleDelete(event._id);
              }}
            >
              <MdDelete className="absolute top-2 right-2 w-7 h-7 text-red-500 m-5 bg-red-200 border border-black rounded" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
