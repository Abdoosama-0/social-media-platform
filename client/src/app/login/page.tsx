"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "../../store/userData";

const Page = () => {
  const router = useRouter();
  const setUser = useUserData((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayPass, setDisplayPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/localLogin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }
      alert("success");

      setUser({
        userName: data.userData.username,
        email: data.userData.email,
        id: data.userData._id,
        photo: data.userData.profileImageURL,
        role: data.userData.role,
      });

      router.push("/");
    } catch (err) {
      alert(err);
      setError("Something went wrong");
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
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-muted">Sign in to your account</p>
        </div>

        <div>
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={displayPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-16"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setDisplayPass(!displayPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {displayPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-error text-sm text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg w-full"
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center space-y-3 pt-2">
          <a className="link text-sm" href="http://localhost:3000/ForgetPassword">
            Forgot password?
          </a>

          <p className="text-sm text-muted">
            Don&apos;t have an account?{" "}
            <a href="/register" className="link">
              Register
            </a>
          </p>

          <a
            className="btn btn-secondary btn-md w-full inline-flex"
            href="http://localhost:5000/auth/google"
          >
            Login with Google
          </a>
        </div>
      </form>
    </div>
  );
};

export default Page;
