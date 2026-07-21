import React from "react";
import Post from "./Post";
import Following from "./following";
import Followers from "./followers";
import EditProfile from "./EditProfile";
import DeleteUser from "./DeleteUser";
import { useUserData } from "@/store/userData";
import type { Post as PostType, ProfileData } from "@/types";

type ProfileProps = {
  data: ProfileData | null;
  posts: PostType[];
  setPosts?: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const Profile = ({ data, posts, setPosts }: ProfileProps) => {
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

  const { id } = useUserData.getState();
  const [preview, setPreview] = React.useState("");

  if (!data) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted">
          <span className="spinner" aria-hidden />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  const isOwnProfile = data.user._id === id;

  return (
    <div className="page-container max-w-3xl">
      <div className="card overflow-hidden mb-8">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />

        <div className="px-4 sm:px-6 pb-6 -mt-12 sm:-mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <img
              src={data.user.profileImageURL}
              alt={`${data.user.name}'s profile`}
              className="avatar avatar-xl cursor-zoom-in ring-4 ring-surface"
              onClick={() => setPreview(data.user.profileImageURL)}
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold truncate">
                {data.user.name}
              </h1>
              <p className="text-muted truncate">@{data.user.username}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isOwnProfile && data.isFollowingAuthor && (
                <button
                  type="button"
                  onClick={() => handleFollowToggle(data.user._id)}
                  className="btn btn-secondary btn-md"
                >
                  {data.isFollowingAuthor ? "Unfollow" : "Follow"}
                </button>
              )}
              {isOwnProfile && (
                <EditProfile
                  profileImageURL={data.user.profileImageURL}
                  name={data.user.name}
                  username={data.user.username}
                  email={data.user.email}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="stat-card text-center py-3">
              <p className="text-lg font-semibold">{data.postsCount}</p>
              <p className="text-xs text-muted">Posts</p>
            </div>
            <div className="stat-card text-center py-3">
              <div className="flex items-center justify-center gap-1">
                <p className="text-lg font-semibold">{data.followersCount}</p>
                <Followers id={data.user._id} />
              </div>
              <p className="text-xs text-muted">Followers</p>
            </div>
            <div className="stat-card text-center py-3">
              <div className="flex items-center justify-center gap-1">
                <p className="text-lg font-semibold">{data.followingCount}</p>
                <Following id={data.user._id} />
              </div>
              <p className="text-xs text-muted">Following</p>
            </div>
            <div className="stat-card text-center py-3">
              <p className="text-lg font-semibold capitalize">
                {data.user.role}
              </p>
              <p className="text-xs text-muted">Role</p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-muted">
              <span className="text-foreground font-medium">Email:</span>{" "}
              {data.user.email}
            </p>
            <p className="text-muted text-xs font-mono truncate">
              ID: {data.user._id}
            </p>
          </div>
        </div>
      </div>

      {preview && (
        <div
          className="image-lightbox"
          onClick={() => setPreview("")}
          role="dialog"
          aria-label="Profile image preview"
        >
          <img
            src={preview}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Posts</h2>
        <p className="text-sm text-muted">
          {data.postsCount > 0
            ? `${data.postsCount} post${data.postsCount === 1 ? "" : "s"}`
            : "No posts yet"}
        </p>
      </div>

      {data.postsCount > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Post key={post._id} post={post} setPosts={setPosts} />
          ))}
        </div>
      ) : (
        <div className="card empty-state py-12">
          <p className="text-sm">No posts found.</p>
        </div>
      )}

      {isOwnProfile && (
        <div className="mt-8 pt-6 border-t border-border">
          <DeleteUser />
        </div>
      )}
    </div>
  );
};

export default Profile;
