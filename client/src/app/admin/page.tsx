"use client";

import Link from "next/dist/client/link";
import React, { useEffect, useState } from "react";

type SiteStatistics = {
  totalUsers: number;
  blockedUsers: number;
  activeUsers: number;
  admins: number;
  newUsersLastWeek: number;
  totalPosts: number;
};
type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImageURL: string;
  isBanded: boolean;
  role: string;
};



const Page = () => {
  const [stats, setStats] = useState<SiteStatistics | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const siteStatistics = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/admins/siteStatistics",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.error);
        return;
      }

      setStats(data);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
const users = async () => {
  try {
    const res = await fetch("http://localhost:5000/admins/users", {
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || data.error);
      return;
    }

    setUsersList(data.allUsers);
  } catch (err) {
    console.log(err);
  }
};

const blockUser = async (userId: string) => {
  try {
    const res = await fetch(
      `http://localhost:5000/admins/blockUser/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || data.error);
      return;
    }
    
    

    alert(data.msg);

    users();
    siteStatistics();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (userId: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/admins/deleteUser/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || data.error);
      return;
    }

    alert(data.msg);


    users();
    siteStatistics();
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

useEffect(() => {
  siteStatistics();
  users();
}, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome Admin</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Total Users</h2>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Active Users</h2>
            <p className="text-2xl">{stats.activeUsers}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Blocked Users</h2>
            <p className="text-2xl">{stats.blockedUsers}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Admins</h2>
            <p className="text-2xl">{stats.admins}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">New Users (Last Week)</h2>
            <p className="text-2xl">{stats.newUsersLastWeek}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Total Posts</h2>
            <p className="text-2xl">{stats.totalPosts}</p>
          </div>
        </div>
      )}
      <div className="mt-8">
  <h2 className="text-xl font-bold mb-4">Users</h2>

  <div className="space-y-3">
    {usersList?.map((user) => (
      <Link href={`/${user._id}`}
        key={user._id}
        className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <img
            src={user.profileImageURL || "/default-profile.png"}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="font-semibold">{user._id}</p>

            <p className="text-gray-500">{user.username}</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>

<div className="flex gap-2">
  <button
    onClick={(e) => {
      e.preventDefault();
      blockUser(user._id);
    }}
    className={`px-4 py-2 rounded text-white ${
      user.isBanded
        ? "bg-blue-500 hover:bg-blue-600"
        : "bg-yellow-600 hover:bg-yellow-700"
    }`}
  >
    {user.isBanded ? "unBand" : "Band"}
  </button>

  <button
    onClick={(e) => {
      e.preventDefault();
      deleteUser(user._id);
    }}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
  >
    Delete
  </button>
</div>
      </Link>
    ))}
  </div>
</div>
    </div>
  );
};

export default Page;