"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      if (image) {
        alert("img");
        formData.append("profileImageURL", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/verify-otp?email=${email}`);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-narrow flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
      <form
        onSubmit={handleRegister}
        className="card w-full p-6 sm:p-8 space-y-5"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold mb-1">Create account</h1>
          <p className="text-sm text-muted">Join SocialNet today</p>
        </div>

        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="profile-image" className="label">
            Profile image
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
            className="input file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-surface-hover"
          />
          {imagePreview && (
            <div className="mt-3 flex justify-center">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="avatar avatar-xl object-cover"
              />
            </div>
          )}
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
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-sm text-muted text-center">
          Already have an account?{" "}
          <a href="/login" className="link">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
