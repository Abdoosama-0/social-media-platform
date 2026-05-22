import React from 'react'
import { AiFillLike } from 'react-icons/ai'

const Like = ({setPosts,postId}:any) => {

const handleLike = async (postId: string) => {
  try {
    const res = await fetch(
      `http://localhost:5000/posts/Like/${postId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }
    

    setPosts((prev: any) =>
      prev.map((post: any) =>
        post._id === postId
          ? data.post
          : post
      )
    );

  } catch (error) {
    console.log(error);
  }
};  return (
<AiFillLike className='cursor-pointer' onClick={()=>handleLike(postId)} />
  )
}

export default Like