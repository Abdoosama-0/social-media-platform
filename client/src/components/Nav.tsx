"use client";

import Link from "next/link";
import React from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import { useUserData } from "../store/userData";
import CreatePost from "./CreatePost";

const Nav = () => {
    const userName = useUserData((state) => state.userName);

  const router = useRouter();

  const clearUserData = useUserData(
    (state) => state.clearUserData
  );

  const handleLogout = async () => {
    try {
      await fetch(
        "http://localhost:5000/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      // امسح بيانات المستخدم من zustand
      clearUserData();
      alert("logged out successfully")

      // رجّعه للـ login
      router.push("/login");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center gap-5 text-3xl p-5">
{userName ?

  (
  <div>

  <Link href={"/account"}>
        <RiAccountCircleFill />
      </Link>
          <button onClick={handleLogout}>
        <CiLogout />
      </button>
           <Link href={"/"}>
        <FaHome />
      </Link>
     < CreatePost/>
      </div>
    ):
      (
  <div>
    
 <Link href={"/"}>
        <FaHome />
      </Link>
  <Link href={"/login"}>
     <CiLogin />

      </Link>

      </div>
    )

}
    



 

    </div>
  );
};

export default Nav;