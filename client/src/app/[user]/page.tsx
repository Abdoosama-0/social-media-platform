"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Comments from "@/components/Comments";
import Like from "@/components/Like";
import Likes from "@/components/Likes";
import Post from "@/components/Post";
import Profile from "@/components/profile";



const Page = () => {
  const params = useParams();
  const userId = params.user as string;

  const [posts, setPosts] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message,setMessage]=useState("");

  useEffect(() => {
    const getUserPosts = async () => {
      try {
    const res = await fetch(
  `http://localhost:5000/users/${userId}`,
  {
    method: "GET",
    credentials: "include",
  }
);

        const data = await res.json();

        if (!res.ok) {
            alert("err" + data.msg)
            
            return


        }
                  setData(data);
                   setPosts(data.user.posts);

      } catch (error) {
        alert("ss")
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
    return <div>Loading...</div>;
  }

  return (
   <Profile data={data} posts={posts} setPosts={setPosts} />
  );
};

export default Page;