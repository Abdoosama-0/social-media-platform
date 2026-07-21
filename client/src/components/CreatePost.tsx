"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const CreatePost = () => {
  const [clicked, setClicked] = useState(false);
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);

      media.forEach((file) => {
        formData.append("media", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to create post");
        return;
      }

      console.log(data.post);

      setTitle("");
      setClicked(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setClicked(true)}
        className="nav-link bg-olive-900 hover:bg-olive-800/90 "
        aria-label="Create post"
      >
        <FaPlus className="text-base text-white" />
        <span className="hidden sm:inline text-white">Create</span>
      </button>

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-post-title"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePost}
            className="modal-content max-w-lg"
          >
            <div className="modal-header">
              <h2 id="create-post-title" className="text-lg font-semibold">
                Create Post
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
              <div>
                <label htmlFor="post-title" className="label">
                  Title
                </label>
                <input
                  id="post-title"
                  type="text"
                  placeholder="What's on your mind?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="post-media" className="label">
                  Media
                </label>
                <input
                  id="post-media"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    console.log("onChange fired");

                    const files = e.target.files;

                    if (!files) {
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
                  className="input file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-surface-hover file:text-foreground"
                />
              </div>

              {media.length > 0 && (
                <div className="media-preview-grid">
                  {media.map((file, index) => (
                    <div
                      key={index}
                      className="relative card overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMedia((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white text-xs hover:bg-destructive-hover transition-colors"
                        aria-label={`Remove ${file.name}`}
                      >
                        ✕
                      </button>

                      <div className="absolute top-2 left-2 z-10 badge">
                        #{index + 1}
                      </div>

                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          className="media-thumb"
                          alt=""
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          className="media-thumb"
                        />
                      )}

                      <div className="p-2 text-xs text-muted truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="text-error text-sm" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setClicked(false)}
                className="btn btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || media.length === 0}
                className="btn btn-primary btn-md"
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden />
                    Posting...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreatePost;
