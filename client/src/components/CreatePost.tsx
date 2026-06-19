"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreatePost = () => {
  const [clicked, setClicked] = useState(false);

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);

      if (images) {
        Array.from(images).forEach((image) => {
          formData.append("images", image);
        });
      }

      const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to create post");
        setLoading(false);
        return;
      }

      console.log(data.post);

      // reset
      setTitle("");
      setImages(null);

      // اقفل المودال
      setClicked(false);

    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <FaPlus
        onClick={() => setClicked(true)}
        className="text-3xl cursor-pointer"
      />

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >

          {/* modal */}
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePost}
            className="bg-white p-5 rounded flex flex-col gap-4 w-[400px]"
          >

            <h1 className="text-2xl font-bold">
              Create Post
            </h1>

            {/* title */}
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="border p-2 rounded"
            />

            {/* images */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(e.target.files)
              }
              className="border p-2 rounded"
            />

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white p-2 rounded"
            >
              {loading
                ? "Posting..."
                : "Create Post"}
            </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePost;