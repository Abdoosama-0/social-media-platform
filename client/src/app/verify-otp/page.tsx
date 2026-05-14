"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/auth/verifyOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid OTP");
        setLoading(false);
        return;
      }

      // نجاح → روح login
      alert("registered successfully please login")
      router.push("/login");

    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p>Invalid access</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleVerify}
        className="flex flex-col gap-4 w-[350px]"
      >
        <h1 className="text-2xl font-bold">
          Verify OTP
        </h1>

        <p className="text-sm text-gray-500">
          Code sent to: {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 rounded text-center tracking-widest"
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default Page;