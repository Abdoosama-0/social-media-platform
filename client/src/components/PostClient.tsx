"use client";

import { useEffect, useState } from "react";

export default function PostClient({ postId }: { postId: string }) {
  const [post, setPost] = useState(null);

  const getPost = async () => {
    alert(postId)
    const res = await fetch(`http://localhost:5000/posts/${postId}`);
    const data = await res.json();

    setPost(data.post);
  };

  useEffect(() => {
    if (postId) getPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return <div>{post}</div>;
}