import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

type PostMenuProps = {
  postId: string;
};

const PostMenu = ({ postId }: PostMenuProps) => {
  const [clicked, setClicked] = React.useState(false);

  const handleDelete = async () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete your post? This action cannot be undone."
      );
      if (!confirmation) {
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.msg || data.error || "Failed to delete post");
        return;
      }
      alert("Post deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setClicked(!clicked);
        }}
        className="btn btn-ghost btn-icon btn-sm"
        aria-label="Post options"
        aria-expanded={clicked}
      >
        <HiDotsHorizontal />
      </button>

      {clicked && (
        <div
          className="dropdown-menu top-full right-0 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="dropdown-item text-destructive"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMenu;
