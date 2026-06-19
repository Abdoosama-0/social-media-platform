import React from 'react'
import Post from './Post'

const profile = ({ data, posts, setPosts }: any) => {
        const [preview, setPreview] = React.useState("");
    
  return (
      <div className="p-5">
      {data && (
        <div className="flex flex-col gap-3">

          <img
            src={data.user.profileImageURL}
            alt="profile"
            className="w-24 h-24 rounded-full cursor-zoom-in"
            onClick={(e) => {
              e.preventDefault();
              setPreview(data.user.profileImageURL);
            }}
          />

          <h1>Name: {data.user.name}</h1>
          <h1>id : {data.user._id}</h1>

          <p>Username: {data.user.username}</p>

          <p>Email: {data.user.email}</p>

          <p>Role: {data.user.role}</p>

          <hr />

          <p>Posts Count: {data.postsCount}</p>

          <p>Followers Count: {data.followersCount}</p>

          <p>Following Count: {data.followingCount}</p>
          <p>posts:</p>
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

          {posts.map((post: any) => (
      <Post key={post._id} post={post} setPosts={setPosts} />

))}




        </div>
      ) }
    </div>
  )
}

export default profile