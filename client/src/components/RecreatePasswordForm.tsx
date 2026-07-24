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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/recreatePassword?token=${token}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.msg || "Something went wrong");
        return;
      }

      alert("Password changed successfully");
        window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-narrow flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <form
        onSubmit={handleSubmit}
        className="card w-full p-6 sm:p-8 space-y-5"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold mb-1">Reset Password</h1>
          <p className="text-sm text-muted">Enter your new password below</p>
        </div>

        <div>
          <label htmlFor="new-password" className="label">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-16"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input pr-16"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-accent btn-lg w-full"
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden />
              Updating...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
}


