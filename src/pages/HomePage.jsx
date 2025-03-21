import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AchievementSection from "../components/AchievementSection";
import EquipmentSection from "../components/EquipmentSection";
import FeaturedEventSection from "../components/FeaturedEventSection";
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  const navigate = useNavigate();
  
  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // If token exists, navigate to homepage
    if (token) {
      navigate("/"); // Redirect to homepage if already logged in
    }
  }, [token, navigate]);

  return (
    <>
      <main className="min-h-screen flex-grow">
        <HeroSection />
        <FeaturedEventSection />
        <EquipmentSection />
        <AchievementSection />
      </main>
    </>
  );
};

export default HomePage;
