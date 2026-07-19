"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RecreatePassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
       `http://localhost:5000/auth/recreatePassword?token=${token}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
       newPassword: password
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
      
        alert(data.error || data.msg|| "Something went wrong");
        return;
      }

      alert("Password changed successfully");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <h1>Reset Password</h1>
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border p-2 w-full pr-16"
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>
<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="border p-2 w-full pr-16"
    required
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
  >
    {showConfirmPassword ? "Hide" : "Show"}
  </button>
</div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Change Password
      </button>
    </form>
  );
}