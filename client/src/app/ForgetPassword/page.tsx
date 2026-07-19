"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
    const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        alert(data.msg || data.error|| "Something went wrong");
        return;
      }

      alert(data.msg);
      router.push("/ForgetPassword/checkEmail");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <h1>Enter your email</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border-2 border-black p-2"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default Page;