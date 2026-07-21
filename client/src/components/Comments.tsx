"use client";

import { useUserData } from "@/store/userData";
import React from "react";
import { FaImage, FaRegComment } from "react-icons/fa";
import { RiCloseLine, RiSendPlaneFill } from "react-icons/ri";
import CommentMenu from "./CommentMenu";
import type { Comment, Post } from "@/types";

type CommentsProps = {
  postId: string;
  commentsCount: number;
  setPost?: React.Dispatch<React.SetStateAction<Post | null>>;
};

const Comments = ({ postId, commentsCount, setPost }: CommentsProps) => {
  const { id } = useUserData();
  const [clicked, setClicked] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [commentImage, setCommentImage] = React.useState<File | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const getPostComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/comments/${postId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.msg);
        return;
      }
      console.log(data);

      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const sendComment = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("comment", commentText);

      if (commentImage) {
        formData.append("commentImage", commentImage);
      }

      const res = await fetch(
        `http://localhost:5000/posts/addComment/${postId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(
          "Error: " +
            data.msg +
            data.err +
            " " +
            data.error +
            data.message
        );
        setLoading(false);
        return;
      }
      getPostComments();
      setCommentText("");
      setCommentImage(null);
      setPreviewImage(null);
      console.log(data);
      setLoading(false);
      if (setPost) {
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
          };
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setClicked(true);
          getPostComments();
        }}
        className="flex items-center gap-1.5 text-lg  text-muted hover:text-foreground transition-colors"
      >
        <FaRegComment className="text-base" />
        <span>
          {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
        </span>
      </button>

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="comments-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content max-w-md flex flex-col max-h-[85vh]"
          >
            {loading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/80 text-primary-foreground rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="spinner" aria-hidden />
                  <p>Sending comment...</p>
                </div>
              </div>
            )}

            <div className="modal-header shrink-0">
              <h2 id="comments-modal-title" className="text-lg font-semibold">
                Comments
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[350px]">
              {comments.length === 0 ? (
                <div className="empty-state py-8">
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded-xl p-3 bg-surface-hover border border-border"
                  >
                    <div className="flex items-start gap-2 justify-between">
                      <p className="text-sm flex-1">{comment.comment}</p>

                      {comment.userid._id === id && (
                        <CommentMenu
                          setComments={setComments}
                          commentId={comment._id}
                          comment={comment.comment}
                        />
                      )}
                    </div>
                    {comment.commentImage && (
                      <div className="mt-2 rounded-lg overflow-hidden bg-background">
                        <img
                          src={comment.commentImage}
                          alt="Comment attachment"
                          className="max-w-full max-h-60 w-auto h-auto object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {previewImage && (
              <div className="px-4 pb-2 shrink-0">
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full max-h-52 object-contain bg-surface-hover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setCommentImage(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 btn btn-destructive btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-border p-4 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="input flex-1"
                aria-label="Comment text"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-icon shrink-0"
                aria-label="Attach image"
              >
                <FaImage />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];

                    setCommentImage(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />

              <button
                type="button"
                onClick={sendComment}
                className="btn btn-accent btn-icon shrink-0"
                aria-label="Send comment"
              >
                <RiSendPlaneFill />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
