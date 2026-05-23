"use client";

import React, { useEffect, useState } from "react";
import Post from "@/components/Post";
import { useParams } from "next/navigation";
import Comments from "@/components/Comments";
import Likes from "@/components/Likes";
import Like from "@/components/Like";
import { formatPostDate } from "@/components/formatPostDate";
import Link from "next/link";

const Page = () => {
  const [post, setPost] = useState<any>(null);
    const params = useParams();
  const postId = params.post;

  const getPost = async () => {
  
    try {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "err")

        return;
      
      }
    
     
      setPost(data.post);
     
    } catch (error) {
      alert("err" + error)
      console.log(error);
    }
  };
useEffect(() => {
  if (postId) {
    getPost();
  }
}, [postId]);


    const [preview, setPreview] = React.useState("");

  return (
   <>
  {post && (
     <div
  key={post._id}
  className="border w-fit p-4 rounded cursor-pointer"
  
>
{post._id }
  {/* user */}
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
setPreview(post.author.profileImageURL);    
  }}
    />

    <p className="font-bold">
      {post.author.name}
    </p>
  </Link>

  {/* post content */}
  

<p>{formatPostDate(post.createdAt)}</p>
    <h2 className="mb-3">
      {post.title}
    </h2>

    {post.images.length > 0 && (
      <img
        src={post.images[0]}
        alt="post"
        className="rounded max-w-[500px] cursor-zoom-in"
        onClick={() => setPreview(post.images[0])}

      />
    )}

    {/* image preview */}
    {preview && (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={() => setPreview("")}
      >
        <img
            src={preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded"
        />
      </div>
    )}



  {/* OPTIONS */}
  <div className="mt-3 flex items-center gap-2">

    <div className="flex gap-1">
      <Like  setPost={setPost} postId={post._id} />

      <Likes post={post}  />
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
)}</>
);
};

export default Page;