import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'

const PostMenu = ({postId}:any) => {
    const [clicked, setClicked] = React.useState(false)
    const handleDelete = async () => {
        try {
             const confirmation = window.confirm("Are you sure you want to delete your post? This action cannot be undone.");
            if (!confirmation) {
                return; // User canceled the deletion
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) {
                
                console.error(data.msg || data.error ||'Failed to delete post');
                return;
            }
            alert('Post deleted successfully');
            // Optionally, you can refresh the page or update the state to remove the deleted post from the UI
            window.location.reload(); // Refresh the page to reflect the deletion
        }
        catch (error) {
            console.error('Error deleting post:', error);
        }
    }

  return (
    <div className='relative '>

        <CiMenuKebab  onClick={(e) => {  e.preventDefault();
              e.stopPropagation();setClicked(!clicked)}} />
        {clicked && (
            <div className='absolute top-full right-0 bg-white shadow-lg rounded-md p-2'>
                {/* <button className='block px-4 py-2 hover:bg-gray-100'>Edit</button> */}
                <button className='block px-4 py-2 hover:bg-gray-100' onClick={handleDelete}>
                    Delete
                </button>
            </div>
        )}

    </div>
  )
}

export default PostMenu