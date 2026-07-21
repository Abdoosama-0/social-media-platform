"use client";

import Profile from "@/components/profile";
import React, { useEffect, useState } from "react";
import type { Post, ProfileData } from "@/types";

const Page = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const result = await res.json();

        setData(result);
        setPosts(result.user.posts);
      } catch (err) {
        console.log(err);
      }
    };

    getMe();
  }, []);

  return <Profile data={data} posts={posts} setPosts={setPosts} />;
};

export default Page;
