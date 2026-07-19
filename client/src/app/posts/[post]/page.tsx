"use client";

import React, { useEffect, useState } from "react";
import Comments from "@/components/Comments";
import Likes from "@/components/Likes";
import Like from "@/components/Like";
import { formatPostDate } from "@/components/formatPostDate";
import Link from "next/link";
import { useUserData } from "@/store/userData";
import { useParams } from "next/navigation";

type Media = {
  type: "image" | "video";
  url: string;
  order: number;
};

const Page = () => {
  const [post, setPost] = useState<any>(null);
  const [preview, setPreview] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const params = useParams();
  const postId = params.post;

  const { id } = useUserData.getState();

  // GET POST
  const getPost = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setPost(data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (postId) getPost();
  }, [postId]);

  // reset index
  useEffect(() => {
    setCurrentIndex(0);
  }, [post]);

  const sortedMedia: Media[] = [...(post?.media || [])].sort(
    (a, b) => a.order - b.order
  );

  const next = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === sortedMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prev = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? sortedMedia.length - 1 : prev - 1
    );
  };

  const handleFollowToggle = async (userId: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setPost((prev: any) => ({
        ...prev,
        isFollowingAuthor: !prev.isFollowingAuthor,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {post && (
        <div className="border w-fit p-4 rounded">
          {/* ID */}
          <h1>{post._id}</h1>

          {/* USER */}
          <Link
            href={`/${post.author._id}`}
            className="flex items-center gap-2 mb-3 w-fit border p-3 rounded hover:bg-gray-100"
          >
            <img
              src={post.author.profileImageURL}
              className="w-10 h-10 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                setPreview(post.author.profileImageURL);
              }}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                handleFollowToggle(post.author._id);
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              {post.author._id !== id &&
                (post.isFollowingAuthor ? "Unfollow" : "Follow")}
            </button>

            <p className="font-bold">{post.author.name}</p>
          </Link>

          {/* TITLE */}
          <p>{formatPostDate(post.createdAt)}</p>
          <h2 className="mb-3">{post.title}</h2>

          {/* MEDIA SLIDER */}
          {sortedMedia.length > 0 && (
            <div className="relative w-[600px] h-[600px]">
              {sortedMedia[currentIndex].type === "image" ? (
                <img
                  src={sortedMedia[currentIndex].url}
                  className="w-full h-full object-cover rounded cursor-zoom-in"
                  onClick={() =>
                    setPreview(sortedMedia[currentIndex].url)
                  }
                />
              ) : (
                <video
                  src={sortedMedia[currentIndex].url}
                  controls
                  className="w-full h-full object-cover rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Prev */}
              {sortedMedia.length > 1 && (
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  ‹
                </button>
              )}

              {/* Next */}
              {sortedMedia.length > 1 && (
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  ›
                </button>
              )}

              {/* Counter */}
              {sortedMedia.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-2 rounded">
                  {currentIndex + 1} / {sortedMedia.length}
                </div>
              )}
            </div>
          )}

          {/* PREVIEW */}
          {preview && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setPreview("")}
            >
              <img
                src={preview}
                className="max-h-[90vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* OPTIONS */}
          <div className="mt-3 flex gap-2">
            <Like setPost={setPost} postId={post._id} />
            <Likes post={post} />
            <Comments
              setPost={setPost}
              postId={post._id}
              commentsCount={post.commentsCount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;