"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/auth/forgetPassword",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.error || "Something went wrong");
        return;
      }

      alert(data.msg);
      router.push("/ForgetPassword/checkEmail");
    } catch (error) {
      console.error(error);
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
          <h1 className="text-2xl font-semibold mb-1">Reset password</h1>
          <p className="text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div>
          <label htmlFor="reset-email" className="label">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-accent btn-lg w-full"
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden />
              Sending...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default Page;
