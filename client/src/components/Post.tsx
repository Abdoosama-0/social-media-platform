import React from 'react'
import Like from './Like';
import Likes from './Likes';
import Comments from './Comments';
import Link from 'next/dist/client/link';
import { formatPostDate } from './formatPostDate';

type Author = {
    _id: string;
    name: string;
    profileImageURL: string;
};

type Comment = {
    _id: string;
    userid: string;
    comment: string;
    commentImage?: string;
    createdAt: string;
    updatedAt: string;
};

type PostProps = {
    isFollowingAuthor: boolean;
    _id: string;
    author: Author;
    title: string;
    images: string[];
    likes: string[];
    likesCount: number;
    comments: Comment[];
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
type Props = {
    post: PostProps;
    setPosts?: React.Dispatch<React.SetStateAction<any[]>>;
}

const Post = ({
    post, setPosts
}: Props) => {
const [isFollowing,setIsFollowing] = React.useState(post.isFollowingAuthor);
const handleFollowToggle = async (userId: any) => {
  
  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    // تحديث UI مباشرة
    setPosts?.((prev) =>
      prev.map((p) =>
        p.author._id === userId
          ? {
              ...p,
              isFollowingAuthor: !isFollowing,
            }
          : p
      )
      
    );
    setIsFollowing(!isFollowing)
  } catch (error) {
    console.log(error);
  }
};

    const [preview, setPreview] = React.useState("");
    console.log("post", post) 
    return (
     <div
  key={post._id}
  className="border w-fit p-4 rounded cursor-pointer"
  onClick={() => {window.location.href = `/posts/${post._id}`}}
>
  <h1 className='cursor-default' onClick={(e)=>{e.stopPropagation()}}>{post._id }</h1>

  {/* user */}
  <div  className="flex items-center gap-1 mb-3 w-fit border p-3 rounded">   
  <Link
    href={`/${post.author._id}`}
    className="flex items-center gap-1 mb-3 w-fit border p-3 rounded"
  >
    <img
      src={post.author.profileImageURL}
      alt="profile"
      className="w-10 h-10 rounded-full cursor-zoom-in"
      onClick={(e) => {
        e.preventDefault();
setPreview(post.author.profileImageURL);    
  }}
    />

    <button  onClick={(e) => {e.preventDefault() , e.stopPropagation() ,handleFollowToggle(post.author._id)}} className='text-sm text-gray-500'>


{isFollowing ? "Unfollow" : "Follow"}
  </button>
      </Link>

    <p className="font-bold">
      {post.author.name}
    </p>
      <h1 className='cursor-default' onClick={(e)=>{e.stopPropagation()}}>{post.author._id }</h1>

 </div>

  {/* post content */}
  

<p>{formatPostDate(post.createdAt)}</p>
    <h2 className="mb-3">
      {post.title}
    </h2>

    {post.images.length > 0 && (
      <img
   
        src={post.images[0]}
        alt="post"
        className="rounded max-w-[500px] cursor-zoom-in"
        onClick={(e) =>{ e.stopPropagation() ,setPreview(post.images[0]) }}

      />
    )}

    {/* image preview */}
    {preview && (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-default"
        onClick={(e) => {setPreview(""), e.stopPropagation()}}
      >
        <img
        onClick={(e) => { e.stopPropagation()}}
            src={preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded cursor-default"
        />
      </div>
    )}



  {/* OPTIONS */}
  <div className="mt-3 flex items-center gap-2">

    <div className="flex gap-1">
      <Like setPosts={setPosts} postId={post._id} />

      <Likes post={post} />
    </div>

    <div className="flex gap-2">
      <Comments
        postId={post._id}
        commentsCount={post.commentsCount}
      />
    </div>

  </div>

</div>

    )
}

export default Post