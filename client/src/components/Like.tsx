import React, { useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import type { Post } from "@/types";

type LikeProps = {
  postId: string;
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
  setPost?: React.Dispatch<React.SetStateAction<Post | null>>;
  post: any;
};

const Like = ({ setPosts, postId, setPost, post }: LikeProps) => {
  // useEffect(() => {
  //   alert(post.isLiked);
  // }, []);
  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/posts/Like/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }
      if (setPost) {
        setPost(data.post);
        return;
      }

      setPosts?.((prev) =>
        prev.map((post) => (post._id === id ? data.post : post))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleLike(postId)}
      className="flex items-center  text-sm text-muted hover:text-accent transition-colors"
      aria-label="Like post"
    >
      {post.isLiked ? (
        <AiFillLike className="text-accent hover:text-muted text-lg cursor-pointer" />
      ) : (
        <AiFillLike className="text-muted hover:text-accent text-lg cursor-pointer" />
      )
      }

    </button>
  );
};

export default Like;
