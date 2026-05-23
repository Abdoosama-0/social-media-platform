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

    const [preview, setPreview] = React.useState("");
    return (
     <div
  key={post._id}
  className="border w-fit p-4 rounded cursor-pointer"
  onClick={() => {window.location.href = `/posts/${post._id}`}}
>
{post._id }
  {/* user */}
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

    <p className="font-bold">
      {post.author.name}
    </p>
  </Link>

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
        onClick={() => setPreview(post.images[0])}

      />
    )}

    {/* image preview */}
    {preview && (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={() => setPreview("")}
      >
        <img
            src={preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded"
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