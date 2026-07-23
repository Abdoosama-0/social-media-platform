"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Profile from "@/components/profile";
import type { Post, ProfileData } from "@/types";

const Page = () => {
  const params = useParams();
  const userId = params.user as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        const responseData = await res.json();

        if (!res.ok) {
          alert("err" + responseData.msg);
          return;
        }
        setData(responseData);
        setPosts(responseData.user.posts);
      } catch (error) {
        alert("ss");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserPosts();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted">
          <span className="spinner" aria-hidden />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return <Profile setData={setData} data={data} posts={posts} setPosts={setPosts} />;
};

export default Page;
