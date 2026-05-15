"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyOtpClient() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid OTP");
        return;
      }

      alert("registered successfully please login");
      router.push("/login");

    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <p>Invalid access</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleVerify} className="flex flex-col gap-4 w-[350px]">
        <h1 className="text-2xl font-bold">Verify OTP</h1>

        <p className="text-sm text-gray-500">
          Code sent to: {email}
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 rounded text-center tracking-widest"
          placeholder="Enter OTP"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button disabled={loading} className="bg-black text-white p-2 rounded">
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}