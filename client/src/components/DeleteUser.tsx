import { useUserData } from "@/store/userData";
import React from "react";

const DeleteUser = () => {
  const clearUserData = useUserData((state) => state.clearUserData);

  const handleDelete = async () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (!confirmation) {
        return;
      }
      const res = await fetch("http://localhost:5000/users/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      clearUserData();

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  return (
    <div className="card p-4 border-destructive/30 bg-destructive/5">
      <h3 className="font-medium text-destructive mb-1">Danger Zone</h3>
      <p className="text-sm text-muted mb-4">
        Permanently delete your account and all associated data.
      </p>
      <button
        type="button"
        className="btn btn-destructive btn-md"
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </div>
  );
};

export default DeleteUser;
