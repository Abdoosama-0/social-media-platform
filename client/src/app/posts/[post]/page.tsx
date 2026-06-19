"use client";

import React, { useEffect, useState } from "react";
import Comments from "@/components/Comments";
import Likes from "@/components/Likes";
import Like from "@/components/Like";
import { formatPostDate } from "@/components/formatPostDate";
import Link from "next/link";
import { useUserData } from "@/store/userData";
import { useParams } from "next/navigation";

const Page = () => {
  const [post, setPost] = useState<any>(null);
  const [preview, setPreview] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      if (!res.ok) {
        alert(data.msg || "err");
        return;
      }

      setPost(data.post);
    } catch (error) {
      alert("err" + error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  // RESET IMAGE INDEX WHEN POST LOADS
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post]);

  // NEXT IMAGE
  const nextImage = (e: any) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  // PREV IMAGE
  const prevImage = (e: any) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  // FOLLOW TOGGLE
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

      const data = await res.json();

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
        <div className="border w-fit p-4 rounded cursor-pointer">
          {/* POST ID */}
          <h1>{post._id}</h1>

          {/* USER */}
          <Link
            href={`/${post.author._id}`}
            className="flex items-center gap-1 mb-3 w-fit border p-3 rounded"
          >
            <img
              src={post.author.profileImageURL}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-zoom-in"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPreview(post.author.profileImageURL);
              }}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFollowToggle(post.author._id);
              }}
              className="text-sm text-gray-500"
            >
              {post.author._id !== id &&
                (post.isFollowingAuthor ? "Unfollow" : "Follow")}
            </button>

            <p className="font-bold">{post.author.name}</p>
          </Link>

          {/* POST CONTENT */}
          <p>{formatPostDate(post.createdAt)}</p>
          <h2 className="mb-3">{post.title}</h2>

          {/* IMAGES SLIDER */}
          {post.images.length > 0 && (
            //not fixed image
    
            //   <div className="relative max-w-[500px]">
            //   <img
            //     src={post.images[currentImageIndex]}
            //     alt="post"
            //     className="rounded w-full cursor-zoom-in "
            //     onClick={() =>
            //       setPreview(post.images[currentImageIndex])
            //     }
            //   />

            //   {/* PREV */}
            //   {post.images.length > 1 && (
            //     <button
            //       onClick={prevImage}
            //       className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
            //     >
            //       ‹
            //     </button>
            //   )}

            //   {/* NEXT */}
            //   {post.images.length > 1 && (
            //     <button
            //       onClick={nextImage}
            //       className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
            //     >
            //       ›
            //     </button>
            //   )}

            //   {/* COUNTER */}
            //   {post.images.length > 1 && (
            //     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-2 rounded">
            //       {currentImageIndex + 1} / {post.images.length}
            //     </div>
            //   )}
            // </div>
            //===================image=================
          <div className="relative w-[600px] h-[600px]">
  <img
    src={post.images[currentImageIndex]}
    alt="post"
    className="w-full h-full object-cover rounded cursor-zoom-in"
    onClick={() => setPreview(post.images[currentImageIndex])}
  />

  {/* Prev */}
  {post.images.length > 1 && (
    <button
      onClick={prevImage}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
    >
      ‹
    </button>
  )}

  {/* Next */}
  {post.images.length > 1 && (
    <button
      onClick={nextImage}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
    >
      ›
    </button>
  )}

  {/* Counter */}
  {post.images.length > 1 && (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-2 rounded">
      {currentImageIndex + 1} / {post.images.length}
    </div>
  )}
</div>
          )}

          {/* PREVIEW MODAL */}
          {preview && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-default"
              onClick={(e) => {
                setPreview("");
                e.stopPropagation();
              }}
            >
              <img
                onClick={(e) => e.stopPropagation()}
                src={preview}
                alt="preview"
                className="max-h-[90vh] max-w-[90vw] rounded cursor-default"
              />
            </div>
          )}

          {/* OPTIONS */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              <Like setPost={setPost} postId={post._id} />
              <Likes post={post} />
            </div>

            <div className="flex gap-2">
              <Comments
                setPost={setPost}
                postId={post._id}
                commentsCount={post.commentsCount}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;