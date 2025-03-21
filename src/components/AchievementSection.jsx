import React from "react";
import { Trophy, Medal, Star } from 'lucide-react';

const AchievementSection = () => {
  return (
    <>
      <section
        className="py-20 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white"
        id="achievements"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">College Achievements</h2>
            <h2 className="text-xl opacity-90">
              Celebrating our sporting excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-4">National Champions</h3>
              <p className="opacity-90">Basketball Team 2023</p>
              <p className="opacity-90">Swimming Team 2023</p>
              <p className="opacity-90">Athletics Team 2022</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <Medal className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-4">Medal Count</h3>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-yellow-400">50+</p>
                <p className="opacity-90">Gold Medals in 2023</p>
                <p className="opacity-90">30+ Silver Medals</p>
                <p className="opacity-90">25+ Bronze Medals</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <Star className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-4">Recognition</h3>
              <p className="opacity-90">Best Sports College 2023</p>
              <p className="opacity-90">Excellence in Sports Education</p>
              <p className="opacity-90">Outstanding Athletic Program</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AchievementSection;
