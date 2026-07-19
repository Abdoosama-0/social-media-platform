import { useUserData } from '@/store/userData';
import React from 'react'

const DeleteUser = () => {
      const clearUserData = useUserData(
        (state) => state.clearUserData
      );
    const handleDelete = async () => {
        try {
       
            const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
            if (!confirmation) {
                return; // User canceled the deletion
            }
            const res = await fetch("http://localhost:5000/users/me", {
                method: "DELETE",
                credentials: "include",

            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }
                  clearUserData();

            // Redirect to login page after successful deletion

            window.location.href = "/login";
        }
        catch (err) {
            console.error(err);
            alert("Error deleting user");
        }
    };
  return (
    <div>
        <button className='bg-red-600 rounded p-2 text-amber-50' onClick={() => {handleDelete()}}>
            DeleteUser
        </button>
    </div>
  )
}

export default DeleteUser