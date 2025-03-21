import React from "react";
import { Dumbbell, CheckCircle } from "lucide-react";

const EquipmentSection = () => {
  return (
    <>
      <section className="py-20 bg-white" id="equipment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sports Equipment
            </h2>
            <p className="text-xl text-gray-600">
              Access top-quality equipment for your training needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Available Equipment
              </h3>
              <div className="space-y-4">
                {[
                  "Basketball Court Equipment",
                  "Football Gear",
                  "Cricket Kit",
                  "Swimming Accessories",
                  "Athletic Track Equipment",
                  "Gym Equipment",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <a href="/equipment-list">
                <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Request Equipment
                </button>
              </a>
            </div>

            <div className="bg-indigo-900 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Equipment Guidelines</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Dumbbell className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Equipment must be requested 24 hours in advance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Dumbbell className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Valid student ID required for equipment checkout</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Dumbbell className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Maximum checkout duration is 7 days</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Dumbbell className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Equipment must be returned in original condition</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EquipmentSection;
