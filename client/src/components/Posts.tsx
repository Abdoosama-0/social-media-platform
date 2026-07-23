"use client";

import React, { useEffect, useState } from "react";
import Post from "./Post";
import type { Post as PostType } from "@/types";
import Search from "./Search";
import CreatePost from "./CreatePost";

const Posts = () => {
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${pageNumber}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setHasMore(data.hasMore);

      setPosts((prev:any) => {
        let updatedPosts: PostType[];

        if (pageNumber === 1) {
          updatedPosts = [...data.posts, ...prev];
        } else {
          updatedPosts = [...prev, ...data.posts];
        }

        const uniquePosts = updatedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p._id === post._id)
        );

        localStorage.setItem("posts", JSON.stringify(uniquePosts));

        return uniquePosts;
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const validateLocalPosts = async () => {
  const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");

  if (savedPosts.length === 0) return [];

  const ids = savedPosts.map((post: PostType) => post._id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/exists`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  localStorage.setItem("posts", JSON.stringify(data.posts));
  return data.posts;
};
useEffect(() => {
  const init = async () => {
 await validateLocalPosts();
await fetchPosts(1);
  };

  init();
}, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 1) return;
    fetchPosts(page);
  }, [page]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {posts.length === 0 && !loading && (
        <div className="card empty-state py-16">
          <p className="text-lg font-medium mb-1">No posts yet</p>
          <p className="text-sm text-muted">
            Follow people or create your first post to get started
          </p>
        </div>
      )}
        <CreatePost />

      {posts.map((post:any) => (
        <Post key={post._id} post={post} setPosts={setPosts} />
      ))}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8 text-muted">
          <span className="spinner" aria-hidden />
          <span className="text-sm">Loading posts...</span>
        </div>
      )}

      <div className="flex justify-center pb-8">
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary btn-md"
          type="button"
        >
          Load more
        </button>
      </div>
    </div>
  );
};

export default Posts;
