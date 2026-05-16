"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Post = {
  _id: string;
  title?: string;
images?: string[];
  createdAt?: string;
};

const Page = () => {
  const params = useParams();
  const userId = params.user as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [message,setMessage]=useState("");

  useEffect(() => {
    const getUserPosts = async () => {
      try {
    const res = await fetch(
  `http://localhost:5000/posts/userPosts/${userId}`,
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
                  setPosts(data.allPosts);

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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">User Posts</h1>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border p-4 rounded-lg shadow"
            >
              {post.title && (
                <p className="mb-3">{post.title}</p>
              )}

              {post.images && (
                <img
                  src={post.images[0]}
                  alt="post"
                  className="w-full max-w-md rounded"
                />
              )}

              {post.createdAt && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;