import React from "react";
import Like from "./Like";
import Likes from "./Likes";
import Comments from "./Comments";
import Link from "next/dist/client/link";
import { formatPostDate } from "./formatPostDate";
import { useUserData } from "@/store/userData";
import PostMenu from "./PostMenu";
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
      className="border w-fit p-4 rounded cursor-pointer   transition-colors"
      onClick={() => {
        window.location.href = `/posts/${post._id}`;
      }}
    >
      {/* <h1
        className="cursor-default"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {post._id}
      </h1> */}
<div className="flex items-center justify-between">
      {/* USER */}
      <div className="flex items-center gap-1 mb-3 w-fit border  p-3 rounded">
        <Link
          href={`/${post.author._id}`}
          className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded"
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
            className="text-sm text-gray-500 hover:underline"
          >
            {post.author._id !== id &&
              (post.isFollowingAuthor ? "Unfollow" : "Follow")}
          </button>
              <p className="font-bold">{post.author.name}</p>
        </Link>

    
      </div>
            {id && post.author._id === id && (<PostMenu postId={post._id} />)}

</div>
      {/* POST CONTENT */}
      <p className="cursor-text w-fit"   onClick={(e) => { e.preventDefault();e.stopPropagation();}}>{formatPostDate(post.createdAt)}</p>

      <h2 className="mb-3 cursor-text w-fit"         onClick={(e) => { e.preventDefault();e.stopPropagation();}}>{post.title}</h2>
{/* MEDIA SLIDER */}
      {sortedMedia.length > 0 && (
        <div className="relative w-[600px] h-[600px] ">
          {sortedMedia[currentIndex].type === "image" ? (
            <img
              src={sortedMedia[currentIndex].url}
              className="w-full h-full object-cover rounded cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(sortedMedia[currentIndex].url);
              }}
            />
          ) : (
            <video
              src={sortedMedia[currentIndex].url}
              controls
              className="w-full h-full object-cover rounded cursor-default"
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-default"
          onClick={(e) => {e.stopPropagation(),setPreview("")}}
        >
          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="flex items-center gap-2 mt-2"> 
      <Like post={post} setPosts={setPosts} />
      <Likes post={post} />
      <Comments post={post} setPosts={setPosts} />
 </div>
     
    </div>
  );
};

export default Post;