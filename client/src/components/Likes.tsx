import Link from 'next/link';
import React, { useEffect } from 'react'

const Likes = ({ post }: { post: any }) => {
    const [clicked, setClicked] = React.useState(false);
const [likes, setLikes] = React.useState<any[]>([]);

const getLikes = async (postId :any) => {
  try {
    const res = await fetch(
      `http://localhost:5000/posts/likes/${postId}`,
      {
        method: "GET",
        credentials: "include",
     
      }
    );

    const data = await res.json();
        if (!res.ok) {
      alert(data.msg||"Failed to fetch likes");
      return;
    }

    setLikes(data.likes);
  } catch (error) {
    alert("Error fetching likes");
    console.log("Error fetching likes:", error);
  }
};



  return (
    <div  >  
       <div className='cursor-pointer' onClick={()=> {
        setClicked(true)
        getLikes(post._id)
        }}>{post.likesCount} Likes</div> 
      {clicked &&
        <div onClick={() => setClicked(false)} className= 'fixed inset-0 bg-black/90  flex items-center justify-center z-50'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white p-5 rounded w-[400px]'>
                <h2 className='text-2xl font-bold mb-5'>likes</h2>
                {likes.length === 0 ? (
                    <p>No likes yet.</p>
                ) : (
                    <ul>
                        {likes.map((like) => (

                            
                                <Link key={like._id} className='flex items-center gap-3 mb-3' href={`/${like._id}`}>
                                <img
                                    src={like.profileImageURL}
                                    alt={like.name}

                                    className='w-10 h-10 rounded-full'
                                />
                                <span>{like.name}</span>   
                                </Link>
                            
                        ))}
                    </ul>
                )}







        </div>
           
           
           
            </div>
            }


</div>
  )
}

export default Likes