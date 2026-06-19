import React from "react";
import Like from "./Like";
import Likes from "./Likes";
import Comments from "./Comments";
import Link from "next/dist/client/link";
import { formatPostDate } from "./formatPostDate";
import { useUserData } from "@/store/userData";

type Author = {
  _id: string;
  name: string;
  profileImageURL: string;
};

type Comment = {
  _id: string;
  userid: string;
  comment: string;
  commentImage?: string;
  createdAt: string;
  updatedAt: string;
};

type PostProps = {
  isFollowingAuthor: boolean;
  _id: string;
  author: Author;
  title: string;
  images: string[];
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Props = {
  post: PostProps;
  setPosts?: React.Dispatch<React.SetStateAction<any[]>>;
};

const Post = ({ post, setPosts }: Props) => {
  const { id } = useUserData.getState();

  const [preview, setPreview] = React.useState("");
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // NEXT IMAGE
  const nextImage = (e: any) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  // PREVIOUS IMAGE
  const prevImage = (e: any) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleFollowToggle = async (userId: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setPosts?.((prev) =>
        prev.map((p) =>
          p.author._id === userId
            ? {
                ...p,
                isFollowingAuthor: !p.isFollowingAuthor,
              }
            : p
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      key={post._id}
      className="border w-fit p-4 rounded cursor-pointer"
      onClick={() => {
        window.location.href = `/posts/${post._id}`;
      }}
    >
      <h1
        className="cursor-default"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {post._id}
      </h1>

      {/* USER */}
      <div className="flex items-center gap-1 mb-3 w-fit border p-3 rounded">
        <Link
          href={`/${post.author._id}`}
          className="flex items-center gap-1"
        >
          <img
            src={post.author.profileImageURL}
            alt="profile"
            className="w-10 h-10 rounded-full cursor-zoom-in"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreview(post.author.profileImageURL);
            }}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFollowToggle(post.author._id);
            }}
            className="text-sm text-gray-500"
          >
            {post.author._id !== id &&
              (post.isFollowingAuthor ? "Unfollow" : "Follow")}
          </button>
        </Link>

        <p className="font-bold">{post.author.name}</p>
      </div>

      {/* POST CONTENT */}
      <p>{formatPostDate(post.createdAt)}</p>

      <h2 className="mb-3">{post.title}</h2>

      {/* IMAGES SLIDER */}
      {post.images.length > 0 && (
              //===================image=================
             
          <div className="relative w-[600px] h-[600px]">
  <img
    src={post.images[currentImageIndex]}
    alt="post"
    className="w-full h-full object-cover rounded cursor-zoom-in"
    onClick={(e) => {
              e.stopPropagation();
              setPreview(post.images[currentImageIndex]);
            }}
  />

  {/* Prev */}
  {post.images.length > 1 && (
    <button
      onClick={prevImage}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
    >
      ‹
    </button>
  )}

  {/* Next */}
  {post.images.length > 1 && (
    <button
      onClick={nextImage}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
    >
      ›
    </button>
  )}

  {/* Counter */}
  {post.images.length > 1 && (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-2 rounded">
      {currentImageIndex + 1} / {post.images.length}
    </div>
  )}
</div>

      )}

      {/* IMAGE PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-default"
          onClick={(e) => {
            setPreview("");
            e.stopPropagation();
          }}
        >
          <img
            onClick={(e) => e.stopPropagation()}
            src={preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded cursor-default"
          />
        </div>
      )}

      {/* OPTIONS */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex gap-1">
          <Like setPosts={setPosts} postId={post._id} />
          <Likes post={post} />
        </div>

        <div className="flex gap-2">
          <Comments
            postId={post._id}
            commentsCount={post.commentsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;