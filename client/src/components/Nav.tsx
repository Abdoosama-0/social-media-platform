"use client";

import Link from "next/link";
import React, { useState } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import {
  FaHome,
  FaPlus,
} from "react-icons/fa";
import {
  RiAccountCircleFill,
  RiDashboardHorizontalFill,
  RiMenu3Line,
  RiCloseLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useUserData } from "../store/userData";
import CreatePost from "./CreatePost";
import Search from "./Search";
import { FaArrowTrendUp } from "react-icons/fa6";

const Nav = () => {
  const { role } = useUserData.getState();
  const userName = useUserData((state) => state.userName);
  const photo = useUserData((state) => state.photo);
  const router = useRouter();
  const clearUserData = useUserData((state) => state.clearUserData);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      clearUserData();
      alert("logged out successfully");
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const navLinks = userName ? (
    <>
      <Link href="/" className="nav-link" aria-label="Home">
        {/* <FaHome className="text-base" />
        <span className="hidden sm:inline">Home</span> */}
      </Link>
      <Link href="/account" className="nav-link" aria-label="Account">
        {photo ? (
          <img src={photo} alt="" className="avatar avatar-sm" />
        ) : (
          <RiAccountCircleFill className="text-lg" />
        )}
        <span className="hidden sm:inline">{userName}</span>
      </Link>
      {/* <CreatePost /> */}
      
      {role === "Admin" && (
        <Link href="/admin" className="nav-link" aria-label="Admin dashboard">
          <RiDashboardHorizontalFill className="text-base" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="nav-link"
        aria-label="Log out"
        type="button"
      >
        <CiLogout className="text-lg" />
        <span className="hidden sm:inline">Logout</span>
     
      </button>
         <Search />
    </>
  ) : (
    <>
      <Link href="/" className="nav-link" aria-label="Home">
        <FaHome className="text-base" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <Link href="/login" className="nav-link" aria-label="Log in">
        <CiLogin className="text-lg" />
        <span className="hidden sm:inline">Login</span>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          {/* <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            S
          </span> */}
          <FaArrowTrendUp className="text-3xl"/>

          <span className="hidden sm:inline text-3xl">Trendy</span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks}
        </nav>

        <button
          type="button"
          className="btn btn-ghost btn-icon md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <RiCloseLine className="text-xl" /> : <RiMenu3Line className="text-xl" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Nav;
