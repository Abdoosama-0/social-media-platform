"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "../../store/userData";

const Page = () => {
  const router = useRouter();

  const setUser = useUserData((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[displayPass,setDisplayPass] =  useState(false);//add this below

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      // login request
        alert(`fetch  ${process.env.NEXT_PUBLIC_API_URL}`)
      const res = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/auth/localLogin`,
        {
          method: "POST",
          credentials: "include", // مهم جدًا للكوكيز
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
      alert("success")

      // خزّن بيانات المستخدم في zustand
      setUser({
        userName: data.userData.username,
        email: data.userData.email,
        id: data.userData.id,
        photo: data.userData.profileImageURL,
      });

      // redirect
      router.push("/");
    } catch (err) {
    alert(err)
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[350px]"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />

   <div className="relative">
  <input
    type={displayPass ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border p-2 rounded w-full pr-16"
  />

  <button
    type="button"
    onClick={() => setDisplayPass(!displayPass)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
  >
    {displayPass ? "Hide" : "Show"}
  </button>
</div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm">
          Don&apos;t have an account؟{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Page;