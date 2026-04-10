import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

const Profile = () => {
  const { updateProfile, isUpdatingProfile, authUser } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setSelectedImage(reader.result);  
    setImagePreview(reader.result);
  };

  reader.readAsDataURL(file);
};

const handleSubmit = async () => {
  if (!selectedImage) {
    return toast.error("Please select an image");
  }

  await updateProfile({ profilePic: selectedImage });


};


  return (
    <div className="p-6 max-w-md mx-auto bg-black rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-center to-blue-600">Profile</h2>

      
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img
          src={
            imagePreview ||
            authUser?.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />

        <label htmlFor="profile-upload">
          <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </label>

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <p className="text-gray-500 text-center mb-4">
        Click the camera icon to change profile pic
      </p>

     
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Name</label>
          <input
            type="text"
            value={authUser?.name || ""}
            readOnly
            className="w-full p-3 text-gray-700 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="text"
            value={authUser?.email || ""}
            readOnly
            className="w-full p-3 text-gray-700 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isUpdatingProfile}
        className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {isUpdatingProfile ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default Profile;
