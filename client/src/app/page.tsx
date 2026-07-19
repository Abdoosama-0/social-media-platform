"use client";

import Image from "next/image";
import { useUserData } from "../store/userData";
import Main from "@/components/Main";
import NotUser from "@/components/NotUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const setUser = useUserData((state) => state.setUser);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const isLoggedIn =async () => {
    const res = await fetch("http://localhost:5000/users/me", {
      method: "GET",
      credentials: "include", // important to include cookies / auth
    });
    const data = await res.json();
    if (!res.ok) {
      return false; // User is not logged in
    }
       setUser({
        userName: data.user.username,
        email: data.user.email,
        id: data.user._id,
        photo: data.user.profileImageURL,
        role: data.user.role,
      });
    return true; // User is logged in
  };
useEffect(() => {
  const checkLoginStatus = async () => {
    const loggedIn = await isLoggedIn();
    setIsAuthenticated(loggedIn);
    if (!loggedIn) {
      // Redirect to login page if not logged in
      router.push("/login");
    }
  };

  checkLoginStatus();
}, []);
const userName = useUserData((state) => state.userName);
  return (
   <div >
    {isAuthenticated&&
    <Main/>
    

    }

   </div>
  );
}
