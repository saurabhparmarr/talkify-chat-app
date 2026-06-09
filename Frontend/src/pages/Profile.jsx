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
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center px-4 py-8">
      <div className="w-full rounded-[28px] border border-indigo-100 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.35)] sm:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">Profile</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-800">Your account</h2>
          <p className="mt-2 text-sm text-slate-500">Update your profile photo and keep your account details tidy.</p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <img
              src={
                imagePreview ||
                authUser?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover shadow-md"
            />

            <label htmlFor="profile-upload">
              <div className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 shadow-lg transition hover:bg-indigo-700">
                <Camera className="h-5 w-5 text-white" />
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

          <p className="mt-4 text-sm text-slate-500">Click the camera icon to change your profile picture</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={authUser?.name || ""}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="text"
              value={authUser?.email || ""}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUpdatingProfile}
          className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
