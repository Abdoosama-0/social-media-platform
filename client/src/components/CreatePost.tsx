"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreatePost = () => {
  const [clicked, setClicked] = useState(false);

  const [title, setTitle] = useState("");
  const [media, setMedia] = useState<File[]>([]);//1

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

      media.forEach((file) => {
        formData.append("media", file);
      });

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
        return;
      }

      console.log(data.post);

      setTitle("");
      // setMedia([]);
      setClicked(false);
      window.location.reload(); // Refresh the page to show the new post
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
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePost}
            className="bg-white p-5 rounded flex flex-col gap-4 w-[500px] max-h-[90vh] overflow-y-auto"
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

            {/* upload */}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
         onChange={(e) => {
  console.log("onChange fired");

  const files = e.target.files;
  // console.log(files);

  if (!files) 
    {
      console.log("No files selected");
      return;

    }

  console.log(Array.from(files));

  setMedia((prev) => {
    const updated = [...prev, ...Array.from(files)];
    console.log(updated);
    return updated;
  });


}}
              className="border p-2 rounded"
            />

            {/* preview */}
            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {media.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded overflow-hidden"
                  >
                    {/* remove */}
                    <button
                      type="button"
                      onClick={(e) => {
                         e.stopPropagation();
                        setMedia((prev) =>
                          prev.filter(
                            (_, i) => i !== index
                          )
                        )
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white z-10"
                    >
                      ✕
                    </button>

                    {/* order */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                      #{index + 1}
                    </div>

                    {/* image */}
                    {file.type.startsWith(
                      "image"
                    ) ? (
                      <img
                        src={URL.createObjectURL(
                          file
                        )}
                        className="w-full h-48 object-cover"
                        alt=""
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(
                          file
                        )}
                        controls
                        className="w-full h-48 object-cover"
                      />
                    )}

                    {/* file name */}
                    <div className="p-2 text-xs break-all">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading || media.length === 0
              }
              className="bg-black text-white p-2 rounded disabled:bg-gray-400"
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