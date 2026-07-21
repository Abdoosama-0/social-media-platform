import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import type { Comment } from "@/types";

interface CommentMenuProps {
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentId: string;
  comment: string;
}

const CommentMenu = ({
  setComments,
  commentId,
  comment,
}: CommentMenuProps) => {
  const [clicked, setClicked] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [newComment, setNewComment] = React.useState(comment);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/deleteComment/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      setComments((prev) => prev.filter((c) => c._id !== id));
      setClicked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id: string) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("comment", newComment);

    if (file) {
      formData.append("commentImage", file);
    }

    const res = await fetch(
      `http://localhost:5000/posts/updateComment/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      setLoading(false);
      return;
    }
    alert("Comment updated successfully");

    setComments((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
              ...c,
              comment: newComment,
              commentImage: file
                ? URL.createObjectURL(file)
                : c.commentImage,
            }
          : c
      )
    );
    setLoading(false);
    setEditMode(false);
    setClicked(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className="btn btn-ghost btn-icon btn-sm"
        onClick={() => setClicked(!clicked)}
        aria-label="Comment options"
        aria-expanded={clicked}
      >
        <HiDotsHorizontal />
      </button>

      {clicked && !editMode && (
        <div className="dropdown-menu top-full right-0 mt-1">
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="dropdown-item"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(commentId)}
            className="dropdown-item text-destructive"
          >
            Delete
          </button>
        </div>
      )}

      {editMode && (
        <div className="absolute top-full right-0 mt-1 z-40 w-64 card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Edit comment</span>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setClicked(false);
              }}
              className="btn btn-ghost btn-icon btn-sm"
              aria-label="Close"
            >
              <RiCloseLine />
            </button>
          </div>

          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input mb-2"
            aria-label="Edit comment text"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
            className="input mb-3 file:mr-2 file:text-sm"
          />

          <button
            type="button"
            onClick={() => handleEdit(commentId)}
            className="btn btn-accent btn-md w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/80 text-primary-foreground rounded-xl">
              Updating...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
