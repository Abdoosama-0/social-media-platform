import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'

interface CommentMenuProps {
    setComments: React.Dispatch<React.SetStateAction<any[]>>;
    commentId: string;
    comment: string;
}

const CommentMenu = ({setComments , commentId, comment}:CommentMenuProps) => {
    const [clicked, setClicked] = React.useState(false)
    const [file, setFile] = React.useState<File | null>(null)
    const [editMode, setEditMode] = React.useState(false)
    const [newComment, setNewComment] = React.useState(comment)
    const [loading, setLoading] = React.useState(false)
const handleDelete = async (commentId: string) => {
  try {
    const res = await fetch(
      `http://localhost:5000/posts/deleteComment/${commentId}`,
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

    setComments((prev) =>
      prev.filter(
        (comment) => comment._id !== commentId
      )
    );

  } catch (error) {
    console.log(error);
  }
};


const handleEdit = async (commentId: string) => {
    setLoading(true)
  const formData = new FormData();

  formData.append("comment", newComment);

  if (file) {
    formData.append("commentImage", file);
  }

  const res = await fetch(
    `http://localhost:5000/posts/updateComment/${commentId}`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {

    alert(data.msg);
    setLoading(false)
    return;
  }
alert("Comment updated successfully");

setComments((prev) =>
  prev.map((c) =>
    c._id === commentId
      ? {
          ...c,
          comment: newComment, // أو editText لو مستخدم state
          commentImage: file ? URL.createObjectURL(file) : c.commentImage,
        }
      : c
  )
); 
  setLoading(false)
setEditMode(false);
setClicked(false);
};
    return (
    <div className="relative">
        <CiMenuKebab className='cursor-pointer' onClick={() => setClicked(true)} />

  
    {clicked && (
      <div className="absolute top-0 left-0 bg-white shadow-lg rounded-lg p-2 z-30">
        <p  className='cursor-pointer' onClick={()=>setClicked(false)}>x</p>
        <button onClick={()=> setEditMode(true)} className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Edit</button>
        <button onClick={()=> handleDelete(commentId)} className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Delete</button>
      </div>
    )}
 {editMode && (
  <div className="absolute top-0 left-0 bg-white shadow-lg rounded-lg p-4 z-30 ">

    {/* المحتوى الأساسي */}
    <div className="opacity-100">
      <p className="cursor-pointer" onClick={() => setEditMode(false)}>
        X
      </p>

      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      <input
        type="file"
          accept="image/*"

        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
        className="mb-2"
      />

      <button
        onClick={() => handleEdit(commentId)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>

    {/* 🔥 loading overlay فوق كل حاجة */}
    {loading && (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white text-lg rounded-lg z-50">
        Updating...
      </div>
    )}
  </div>
)}

    

    </div>
    )
}

export default CommentMenu