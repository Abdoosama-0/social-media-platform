import Link from "next/link";
import React from "react";
import { RiCloseLine } from "react-icons/ri";
import type { LikeUser, Post } from "@/types";

type LikesProps = {
  post: Pick<Post, "_id" | "likesCount">;
};

const Likes = ({ post }: LikesProps) => {
  const [clicked, setClicked] = React.useState(false);
  const [likes, setLikes] = React.useState<LikeUser[]>([]);
  const [loading, setLoading] = React.useState(false);

  const getLikes = async (postId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/likes/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Failed to fetch likes");
        return;
      }

      setLikes(data.likes);
    } catch (error) {
      alert("Error fetching likes");
      console.log("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="text-lg  text-muted hover:text-foreground transition-colors"
        onClick={() => {
          setClicked(true);
          getLikes(post._id);
        }}
      >
        {post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}
      </button>

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="likes-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content max-w-md"
          >
            <div className="modal-header">
              <h2 id="likes-modal-title" className="text-lg font-semibold">
                Likes
              </h2>
              <button
                type="button"
                onClick={() => setClicked(false)}
                className="btn btn-ghost btn-icon btn-sm"
                aria-label="Close"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="modal-body">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-muted">
                  <span className="spinner" aria-hidden />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : likes.length === 0 ? (
                <div className="empty-state py-8">
                  <p className="text-sm">No likes yet</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {likes.map((like) => (
                    <li key={like._id}>
                      <Link
                        className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-surface-hover"
                        href={`/${like._id}`}
                        onClick={() => setClicked(false)}
                      >
                        <img
                          src={like.profileImageURL}
                          alt=""
                          className="avatar avatar-md"
                        />
                        <span className="font-medium">{like.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Likes;
