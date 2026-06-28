import React from "react";
import Like from "./Like";
import Likes from "./Likes";
import Comments from "./Comments";
import Link from "next/dist/client/link";
import { formatPostDate } from "./formatPostDate";
import { useUserData } from "@/store/userData";
type Media = {
  type: "image" | "video";
  url: string;
  order: number;
};

type PostProps = {
  isFollowingAuthor: boolean;
  _id: string;
  author: {
    _id: string;
    name: string;
    profileImageURL: string;
  };
  title: string;
  media: Media[];
  likes: string[];
  likesCount: number;
  comments: any[];
  commentsCount: number;
  createdAt: string;
};

type Props = {
  post: PostProps;
  setPosts?: React.Dispatch<React.SetStateAction<any[]>>;
};


const Post = ({ post, setPosts }: Props) => {
  const { id } = useUserData.getState();

  const [preview, setPreview] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
 // sort media
  const sortedMedia = [...(post.media || [])].sort(
    (a, b) => a.order - b.order
  );

  const next = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === sortedMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prev = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? sortedMedia.length - 1 : prev - 1
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
{/* MEDIA SLIDER */}
      {sortedMedia.length > 0 && (
        <div className="relative w-[600px] h-[600px]">
          {sortedMedia[currentIndex].type === "image" ? (
            <img
              src={sortedMedia[currentIndex].url}
              className="w-full h-full object-cover rounded"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(sortedMedia[currentIndex].url);
              }}
            />
          ) : (
            <video
              src={sortedMedia[currentIndex].url}
              controls
              className="w-full h-full object-cover rounded"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Prev */}
          {sortedMedia.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-2 py-1 rounded"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {sortedMedia.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-2 py-1 rounded"
            >
              ›
            </button>
          )}

          {/* Counter */}
          {sortedMedia.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-2 rounded">
              {currentIndex + 1} / {sortedMedia.length}
            </div>
          )}
        </div>
      )}

      {/* PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview("")}
        >
          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
     
    </div>
  );
};

export default Post;