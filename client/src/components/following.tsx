import Link from "next/link";
import React from "react";
import { RiCloseLine } from "react-icons/ri";
import type { FollowUser } from "@/types";

type FollowingProps = {
  id: string;
};

const Following = ({ id }: FollowingProps) => {
  const [clicked, setClicked] = React.useState(false);
  const [following, setFollowing] = React.useState<FollowUser[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchFollowing = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/following`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setFollowing(data.following);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setClicked(true);

    if (following.length === 0) {
      await fetchFollowing();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs text-accent hover:underline"
        aria-label="Show following"
      >
        View
      </button>

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="following-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content max-w-sm"
          >
            <div className="modal-header">
              <h2 id="following-title" className="text-lg font-semibold">
                Following
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
              ) : following.length === 0 ? (
                <div className="empty-state py-8">
                  <p className="text-sm">No following users.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {following.map((user) => (
                    <Link
                      href={`/${user._id}`}
                      key={user._id}
                      className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-surface-hover"
                      onClick={() => setClicked(false)}
                    >
                      <img
                        src={user.profileImageURL}
                        alt=""
                        className="avatar avatar-md"
                      />
                      <span className="font-medium">@{user.username}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Following;
