import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const navigate = useNavigate();

  const id = useSelector((state) => state.auth["id"]);
  const isVerifiedByAdmin = useSelector(
    (state) => state.auth.isVerifiedByAdmin
  );

  const [formData, setFormData] = useState({
    _id: id,
    reason: "",
    duration: 1,
    quantity: 1,
    equipment_id: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/user/equipment")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEquipmentList(
            data.data.map((item) => ({
              id: item._id,
              name: item.equipmentname,
              total: item.TotalQuantity,
              available: item.availableQuantity,
              isAvailable: item.isAvailable,
              category: "Sports Equipment",
              image: item.image,
            }))
          );
        }
      })
      .catch((error) => console.error("Error fetching equipment:", error));
  }, []);

  const categories = ["All", "Sports Equipment"];

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (equipment) => {
    setSelectedEquipment(equipment);
    setFormData((prevData) => ({
      ...prevData,
      equipment_id: equipment.id,
      quantity: 1,
    }));
    setShowRequestForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/equipment/request-equipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Request submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowRequestForm(false);
      } else {
        toast.error("Request failed: " + data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Server error. Try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex justify-between items-center">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sports Equipment Management
            </h1>
            <p className="text-xl text-gray-600">
              Browse and request equipment for your training
            </p>
          </div>
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEquipment.map((equipment) => (
            <div
              key={equipment.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {equipment.name}
                    </h3>
                    <p className="text-gray-600">{equipment.category}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      equipment.available > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {equipment.available > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Available:</span>
                    <span>{equipment.available}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!id) {
                      toast.error("Sign in required!", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    } else if (!isVerifiedByAdmin) {
                      toast.warning("Your profile is not yet approved!", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    } else {
                      handleRequest(equipment);
                    }
                  }}
                  disabled={equipment.available === 0 || !id}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    equipment.available > 0 && id && isVerifiedByAdmin
                      ? "bg-indigo-900 hover:bg-indigo-700 text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showRequestForm && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">
              Request {selectedEquipment.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Reason of Use:
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;
