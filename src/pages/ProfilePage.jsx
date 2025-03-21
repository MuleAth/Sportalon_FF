import React, { useState } from "react";
import { User, Save, Edit2, Camera } from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    dob: "1999-05-15",
    email: "john.doe@example.com",
    phone: "+91-234-567-8901",
    gender: "Male",
    studentId: "SCE2023001",
    institution: "Sinhgad College of Engineering",
    department: "Computer Engineering",
    year: "3rd Year",
    preferredSports: ["Basketball", "Cricket"],
    skillLevel: "Intermediate",
    achievements: [
      { title: "Inter-college Basketball Champion", year: "2023" },
      { title: "Best Athlete Award", year: "2022" },
    ],
    participationHistory: [
      { event: "Intercollege Game Fest 2023" },
    ],
    profileImage: null,
    aadharCard: null, // Store URL or data
    feeReceipt: null, // Store URL or data
    address: "123 Main Street, Pune, Maharashtra, India", // Added Address field
  });

  const handleFileUpload = (field, file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create an object URL for the uploaded file
      setProfile({ ...profile, [field]: fileUrl }); // Update the profile state with the new file URL
    }
  };

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profileImage: imageUrl });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic (e.g., API call) here
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-11">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-950 to-purple-900 rounded-t-2xl p-8 text-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                {isEditing ? (
                  <Save className="h-5 w-5" />
                ) : (
                  <Edit2 className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white/80" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white/20 p-2 rounded-full hover:bg-white/30 backdrop-blur-sm transition-all duration-300 cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <p className="text-indigo-200 mb-1">
                  Student ID: {profile.studentId}
                </p>
                <p className="text-indigo-200">
                  {profile.department} | {profile.year}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-b-2xl shadow-lg p-8 space-y-8">
            {/* Personal Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "name",
                  "studentId",
                  "dob",
                  "email",
                  "phone",
                  "gender",
                  "address",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-gray-500 text-sm capitalize">
                      {field.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </label>
                    {isEditing && field === "gender" ? (
                      <select
                        className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-black"
                        value={profile[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    ) : isEditing &&
                      field !== "studentId" &&
                      field !== "email" &&
                      field !== "phone" ? (
                      <input
                        type="text"
                        className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-black"
                        value={profile[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-800">{profile[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sports Interest */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sports Interest</h2>
              <div className="flex gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    className="border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.preferredSports.join(", ")}
                    onChange={(e) =>
                      handleInputChange(
                        "preferredSports",
                        e.target.value.split(", ")
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-800">
                    {profile.preferredSports.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Achievements</h2>
              {profile.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-2"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-4"
                        value={achievement.title}
                        onChange={(e) => {
                          const updatedAchievements = [...profile.achievements];
                          updatedAchievements[index].title = e.target.value;
                          setProfile({
                            ...profile,
                            achievements: updatedAchievements,
                          });
                        }}
                      />
                      <input
                        type="text"
                        className="border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={achievement.year}
                        onChange={(e) => {
                          const updatedAchievements = [...profile.achievements];
                          updatedAchievements[index].year = e.target.value;
                          setProfile({
                            ...profile,
                            achievements: updatedAchievements,
                          });
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{achievement.title}</span>
                      <span className="text-gray-600">{achievement.year}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Participation History */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Participation History</h2>

              {/* Check if there are participation records */}
              {profile.participationHistory.length > 0 ? (
                profile.participationHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg mb-4"
                  >
                    <div className="flex flex-col">
                      <label className="text-gray-500 text-sm">Event</label>
                      <p className="text-gray-800">{history.event}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-800">No Past Record Found</p>
              )}
            </div>

            {/* Identification Documents */}
            <div className="">
              <h2 className="text-2xl font-bold mb-4">
                Identification Documents
              </h2>
              <div className="grid grid-cols-2">
                <div className="flex flex-col col-span-2">
                  <label className="text-gray-500 text-sm capitalize">
                    College Fee Receipt
                  </label>
                  {isEditing ? (
                    <input
                      type="file"
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload("feeReceipt", e.target.files[0])
                      }
                    />
                  ) : (
                    <p className="text-gray-800">
                      {profile.feeReceipt
                        ? "College Fee Receipt uploaded"
                        : "No College Fee Receipt uploaded"}
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="text-center mt-5 ">
                  <button
                    onClick={handleSave}
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
