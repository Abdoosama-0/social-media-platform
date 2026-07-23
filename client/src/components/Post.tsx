import React from "react";
import Like from "./Like";
import Likes from "./Likes";
import Comments from "./Comments";
import Link from "next/dist/client/link";
import { formatPostDate } from "./formatPostDate";
import { useUserData } from "@/store/userData";
import PostMenu from "./PostMenu";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { Media, Post as PostType } from "@/types";

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
  comments: PostType["comments"];
  commentsCount: number;
  createdAt: string;
};

type Props = {
  post: PostProps;
  setPosts?: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const Post = ({ post, setPosts }: any) => {
  const { id } = useUserData.getState();

  const [preview, setPreview] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const sortedMedia = [...(post.media || [])].sort(
    (a, b) => a.order - b.order
  );

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === sortedMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? sortedMedia.length - 1 : prev - 1
    );
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setPosts?.((prev:any) =>
        prev.map((p:any) =>
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
    <article
      className="card card-hover overflow-hidden cursor-pointer"
      onClick={() => {
        window.location.href = `/posts/${post._id}`;
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/${post.author._id}`}
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={post.author.profileImageURL}
                alt={`${post.author.name}'s profile`}
                className="avatar avatar-md cursor-zoom-in"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPreview(post.author.profileImageURL);
                }}
              />
            </Link>

            <div className="min-w-0">
              <Link
                href={`/${post.author._id}`}
                className="font-semibold hover:underline truncate block"
                onClick={(e) => e.stopPropagation()}
              >
                {post.author.name}
              </Link>
              <time
                className="text-xs text-muted"
                dateTime={post.createdAt}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {formatPostDate(post.createdAt)}
              </time>
            </div>
          </div>

          <div
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {id && post.author._id !== id && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFollowToggle(post.author._id);
                }}
                className="btn btn-secondary btn-sm"
                type="button"
              >
                {post.isFollowingAuthor ? "Unfollow" : "Follow"}
              </button>
            )}
            {id && post.author._id === id && <PostMenu postId={post._id} />}
          </div>
        </div>

        <h2
          className="text-base w-fit sm:text-lg font-medium mb-4 leading-snug cursor-text"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {post.title}
        </h2>
      </div>

      {sortedMedia.length > 0 && (
        <div
          className="relative w-full border-y border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="media-frame rounded-none">
            {sortedMedia[currentIndex].type === "image" ? (
              <img
                src={sortedMedia[currentIndex].url}
                alt={`Post media ${currentIndex + 1}`}
                className="cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(sortedMedia[currentIndex].url);
                }}
              />
            ) : (
              <video
                src={sortedMedia[currentIndex].url}
                controls
                className="cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {sortedMedia.length > 1 && (
            <>
              <button
                onClick={prev}
                className="carousel-btn left-2 sm:left-3"
                aria-label="Previous media"
                type="button"
              >
                <HiChevronLeft className="text-lg" />
              </button>
              <button
                onClick={next}
                className="carousel-btn right-2 sm:right-3"
                aria-label="Next media"
                type="button"
              >
                <HiChevronRight className="text-lg" />
              </button>
              <div className="carousel-counter" aria-live="polite">
                {currentIndex + 1} / {sortedMedia.length}
              </div>
            </>
          )}
        </div>
      )}

      {preview && (
        <div
          className="image-lightbox"
          onClick={(e) => {
            e.stopPropagation();
            setPreview("");
          }}
          role="dialog"
          aria-label="Image preview"
        >
          <img
            src={preview}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div
        className="flex items-center gap-2 px-4 sm:px-5 py-3 border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Like post={post} postId={post._id} setPosts={setPosts} />
        <Likes post={post} />
        <Comments
          postId={post._id}
          commentsCount={post.commentsCount}
          setPosts={setPosts}
          
        />
      </div>
    </article>
  );
};

export default Post;
