import React from 'react'
import Post from './Post'
import Following from './following';
import Followers from './followers';
import EditProfile from './EditProfile';
import DeleteUser from './DeleteUser';

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
         

          <p>Username: {data.user.username}</p>

          <p>Email: {data.user.email}</p>
<EditProfile 
  profileImageURL={data.user.profileImageURL}
  name={data.user.name}
  username={data.user.username}
  email={data.user.email}
/>
          <p>Role: {data.user.role}</p>
           <h1>id : {data.user._id}</h1>

          <hr />

          <p>Posts Count: {data.postsCount}</p>
            <div className='flex gap-2'>
          <p>Followers Count: {data.followersCount}</p><Followers id = {data.user._id} /></div>
<div  className='flex gap-2'>
          <p>Following Count: {data.followingCount}</p> <Following id = {data.user._id} />
          </div>
           <p>posts:</p>
           {data.postsCount > 0 ? (
     < div> 
         
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

)

: (
  <p>No posts found.</p>
)}



   <DeleteUser/>

        </div>
      ) }
   
    </div>
  )
}

export default profile