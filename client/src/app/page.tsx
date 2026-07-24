"use client";

import { useUserData } from "../store/userData";
import Main from "@/components/Main";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const setUser = useUserData((state) => state.setUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const isLoggedIn = async () => {
    const res = await fetch("http://localhost:5000/users/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      alert("wrong");
      return false;
    }
    setUser({
      userName: data.user.username,
      email: data.user.email,
      id: data.user._id,
      photo: data.user.profileImageURL,
      role: data.user.role,
    });
    alert("Welcome back, " + data.user.username + "!");
    return true;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
      setChecking(false);
      if (!loggedIn) {
        alert("You are not logged in. Please log in to continue.");
        router.push("/login");
      }
      if (loggedIn) {
        router.push("/");
      }
    };

    checkLoginStatus();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex items-center gap-3 text-muted">
          <span className="spinner" aria-hidden />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return <div>{isAuthenticated && <Main />}</div>;
}
