"use client"
import { useUserData } from '@/store/userData'
import React, { useEffect } from 'react'
import { FaPlus, FaRegComment } from 'react-icons/fa'
import CommentMenu from './CommentMenu'

const Comments = ({ postId, commentsCount ,setPost}: any) => {
    const { id } = useUserData()
    const [clicked, setClicked] = React.useState(false)
    const [commentText, setCommentText] = React.useState("")
    const [commentImage, setCommentImage] = React.useState<File | null>(null)
    const [comments, setComments] = React.useState<any[]>([])
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false)
    const getPostComments = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/posts/comments/${postId}`,
                {
                    method: "GET",
                    credentials: "include"
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
    }

    const sendComment = async () => {
        try {
            setLoading(true)
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
                alert("Error: " + data.msg + data.err + " " + data.error + data.message);
                setLoading(false)
                return;
            }
            getPostComments();
            setCommentText("");
            setCommentImage(null);
            setPreviewImage(null);
            console.log(data);
            setLoading(false)
            if(setPost) {
                setPost((prev: any) => {
                    return {
                        ...prev,
                        commentsCount: prev.commentsCount + 1
                    }
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };




    return (
        <div>

            <div onClick={() => {
                setClicked(true)
                getPostComments();
            }} className='cursor-pointer flex items-center gap-1'>
                <FaRegComment />
                <span>{commentsCount} Comments</span>


            </div>

            {clicked &&
                <div
                    onClick={() => setClicked(false)}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                >

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
                    >
                        {loading && (
                            <div className="absolute inset-0 text-white text-lg bg-black/90 z-30 flex  items-center justify-center m-auto">
                                <p>Sending comment...</p>
                            </div>
                        )}
                        {/* header */}
                        <div className="border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Comments</h2>

                            <button
                                onClick={() => setClicked(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* comments */}
                        <div className="h-[350px] overflow-y-auto p-4 space-y-3">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    No comments yet
                                </p>
                            ) : (
                                comments.map((comment: any) => (
                                    <div
                                        key={comment._id}
                                        className="bg-gray-100 rounded-xl p-3 "
                                    >
                                        <div className="flex items-center gap-2 justify-between">
                                        <p className="text-sm">
                                            {comment.comment}
                                        </p>


                                        {comment.userid._id === id && (
                                            <CommentMenu setComments={setComments} commentId={comment._id} comment={comment.comment} />
                                        )}
</div>
                                        {comment.commentImage && (
                                            <img
                                                src={comment.commentImage}
                                                alt="comment"
                                                className="mt-2 rounded-lg w-full max-h-60 object-cover"
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* preview image */}
                        {previewImage && (
                            <div className="px-4 pb-2">
                                <div className="relative">
                                    <img
                                        src={previewImage}
                                        alt="preview"
                                        className="w-full h-52 object-cover rounded-xl border"
                                    />

                                    <button
                                        onClick={() => {
                                            setPreviewImage(null);
                                            setCommentImage(null);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* input area */}
                        <div className="border-t p-4 flex items-center gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) =>
                                    setCommentText(e.target.value)
                                }
                                placeholder="Write a comment..."
                                className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-xl"
                            >
                                <FaPlus />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (
                                        e.target.files &&
                                        e.target.files[0]
                                    ) {
                                        const file = e.target.files[0];

                                        setCommentImage(file);
                                        setPreviewImage(
                                            URL.createObjectURL(file)
                                        );
                                    }
                                }}
                            />

                            <button
                                onClick={sendComment}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Comments