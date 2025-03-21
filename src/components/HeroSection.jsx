import React from "react";
import { Play, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = () => {
  const stats = [
    { icon: Users, label: "Active Athletes", value: "500+" },
    { icon: Award, label: "Championships", value: "25+" },
    { icon: Play, label: "Sports", value: "15+" },
  ];

  const navigate = useNavigate();

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  const handleCreateAccountClick = () => {
    if (token) {
      // Show toast notification
      toast.info("You are logged in!", {
        position: "top-right",
        autoClose: 2900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* ToastContainer must be present for toasts to show */}
      <ToastContainer />

      <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-purple-900/80 backdrop-blur-sm"></div>
        </div>

        <div className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto w-full pt-20 pb-16 text-center mt-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              <span className="block mt-10">Unleash Your Potential at</span>
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent py-4">
                Sinhgad College of Engineering
              </span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-indigo-200 max-w-3xl mx-auto">
              Where Champions Are Made. Join Our Elite Sports Program.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a href="/events" rel="noopener noreferrer">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Explore Events
                </button>
              </a>
              <button
                onClick={handleCreateAccountClick}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
                >
                  <Icon className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">
                    {value}
                  </div>
                  <div className="text-indigo-200">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
