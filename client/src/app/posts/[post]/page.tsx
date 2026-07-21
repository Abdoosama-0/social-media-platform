"use client";

import React, { useEffect, useState } from "react";
import Comments from "@/components/Comments";
import Likes from "@/components/Likes";
import Like from "@/components/Like";
import { formatPostDate } from "@/components/formatPostDate";
import Link from "next/link";
import { useUserData } from "@/store/userData";
import { useParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { Media, Post } from "@/types";

const Page = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [preview, setPreview] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const postId = params.post as string;

  const { id } = useUserData.getState();

  const getPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) return;

      setPost(data.post);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) getPost();
  }, [postId]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [post]);

  const sortedMedia: Media[] = [...(post?.media || [])].sort(
    (a, b) => a.order - b.order
  );

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === sortedMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? sortedMedia.length - 1 : prev - 1
    );
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setPost((prev) =>
        prev
          ? {
              ...prev,
              isFollowingAuthor: !prev.isFollowingAuthor,
            }
          : prev
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted">
          <span className="spinner" aria-hidden />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-container">
        <div className="card empty-state py-16">
          <p>Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      <article className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <p className="text-xs font-mono text-muted mb-4 truncate">
            {post._id}
          </p>

          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/${post.author._id}`}
              className="flex items-center gap-3 min-w-0 group"
            >
              <img
                src={post.author.profileImageURL}
                alt={`${post.author.name}'s profile`}
                className="avatar avatar-md shrink-0 cursor-zoom-in"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(post.author.profileImageURL);
                }}
              />
              <div className="min-w-0">
                <p className="font-semibold group-hover:underline truncate">
                  {post.author.name}
                </p>
                <time
                  className="text-xs text-muted"
                  dateTime={post.createdAt}
                >
                  {formatPostDate(post.createdAt)}
                </time>
              </div>
            </Link>

            {post.author._id !== id && (
              <button
                type="button"
                onClick={() => handleFollowToggle(post.author._id)}
                className="btn btn-secondary btn-sm shrink-0"
              >
                {post.isFollowingAuthor ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold mt-4 leading-snug">
            {post.title}
          </h1>
        </div>

        {sortedMedia.length > 0 && (
          <div className="relative w-full border-b border-border">
            <div className="media-frame rounded-none">
              {sortedMedia[currentIndex].type === "image" ? (
                <img
                  src={sortedMedia[currentIndex].url}
                  alt={`Post media ${currentIndex + 1}`}
                  className="cursor-zoom-in"
                  onClick={() => setPreview(sortedMedia[currentIndex].url)}
                />
              ) : (
                <video
                  src={sortedMedia[currentIndex].url}
                  controls
                  className="cursor-default"
                />
              )}
            </div>

            {sortedMedia.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="carousel-btn left-2 sm:left-3"
                  aria-label="Previous media"
                  type="button"
                >
                  <HiChevronLeft className="text-lg" />
                </button>
                <button
                  onClick={next}
                  className="carousel-btn right-2 sm:right-3"
                  aria-label="Next media"
                  type="button"
                >
                  <HiChevronRight className="text-lg" />
                </button>
                <div className="carousel-counter" aria-live="polite">
                  {currentIndex + 1} / {sortedMedia.length}
                </div>
              </>
            )}
          </div>
        )}

        {preview && (
          <div
            className="image-lightbox"
            onClick={() => setPreview("")}
            role="dialog"
            aria-label="Image preview"
          >
            <img
              src={preview}
              alt="Preview"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="flex items-center gap-4 px-4 sm:px-5 py-4">
          <Like setPost={setPost} postId={post._id} />
          <Likes post={post} />
          <Comments
            setPost={setPost}
            postId={post._id}
            commentsCount={post.commentsCount}
          />
        </div>
      </article>
    </div>
  );
};

export default Page;
