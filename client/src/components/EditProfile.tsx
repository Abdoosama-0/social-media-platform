"use client";

import React, { useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

type EditProfileProps = {
  profileImageURL: string;
  name: string;
  username: string;
  email: string;
};

const EditProfile = ({
  profileImageURL,
  name,
  username,
  email,
}: EditProfileProps) => {
  const [clicked, setClicked] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [imagePreview, setImagePreview] = useState(profileImageURL);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <>
      <button
        type="button"
        onClick={() => setClicked(true)}
        className="btn btn-accent btn-md"
      >
        Edit Profile
      </button>

      {clicked && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="modal-content max-w-md"
          >
            <div className="modal-header">
              <h2 id="edit-profile-title" className="text-lg font-semibold">
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={() => setClicked(false)}
                className="btn btn-ghost btn-icon btn-sm"
                aria-label="Close"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="avatar avatar-xl object-cover"
                />

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
                  className="btn btn-secondary btn-sm"
                >
                  Change Profile Image
                </button>
              </div>

              <div>
                <label htmlFor="edit-name" className="label">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="edit-username" className="label">
                  Username
                </label>
                <input
                  id="edit-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="label">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setClicked(false)}
                className="btn btn-secondary btn-md"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-accent btn-md">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditProfile;
