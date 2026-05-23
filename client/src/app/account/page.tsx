"use client";

import Post from "@/components/Post";
import Profile from "@/components/profile";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>(null);
const [posts, setPosts] = useState<any[]>([]);
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

  return (
    <Profile data={data} posts={posts} setPosts={setPosts} />
  
  );
};

export default Page;