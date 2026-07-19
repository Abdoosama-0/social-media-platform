"use client";

import React, { useRef, useState } from "react";

const EditProfile = ({
  profileImageURL,
  name,
  username,
  email,
}: any) => {
  const [clicked, setClicked] = useState(false);

  const [newName, setNewName] = useState(name);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);

  const [imagePreview, setImagePreview] = useState(profileImageURL);
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  const formData = new FormData();

if (newName !== name) {
  formData.append("name", newName);
}

if (newUsername !== username) {
  formData.append("username", newUsername);
}

if (newEmail !== email) {
  formData.append("email", newEmail);
}

if (image) {
  formData.append("profileImageURL", image);
}

    try {
      const res = await fetch("http://localhost:5000/users/me", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.error);
        return;
      }

      alert("Profile updated successfully");
      setClicked(false);
      window.location.reload(); 
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <button
        onClick={() => setClicked(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit Profile
       
      </button>

      {clicked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded w-[400px]"
          >
            <div className="flex justify-center mb-4">
              <img
                src={imagePreview}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-300 w-full p-2 rounded mb-4"
            >
              Change Profile Image
            </button>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setClicked(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProfile;