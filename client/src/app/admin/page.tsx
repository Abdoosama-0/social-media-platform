"use client";

import Link from "next/dist/client/link";
import React, { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineUserAdd,
  HiOutlineDocumentText,
} from "react-icons/hi";
import type { AdminUser, SiteStatistics } from "@/types";

const Page = () => {
  const [stats, setStats] = useState<SiteStatistics | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
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

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted">
          <span className="spinner" aria-hidden />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const statItems = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: HiOutlineUsers,
        },
        {
          label: "Active Users",
          value: stats.activeUsers,
          icon: HiOutlineShieldCheck,
        },
        {
          label: "Blocked Users",
          value: stats.blockedUsers,
          icon: HiOutlineBan,
        },
        { label: "Admins", value: stats.admins, icon: HiOutlineShieldCheck },
        {
          label: "New Users (Last Week)",
          value: stats.newUsersLastWeek,
          icon: HiOutlineUserAdd,
        },
        {
          label: "Total Posts",
          value: stats.totalPosts,
          icon: HiOutlineDocumentText,
        },
      ]
    : [];

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">
          Admin Dashboard
        </h1>
        <p className="text-muted text-sm">Manage users and monitor platform activity</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {statItems.map((item) => (
            <div key={item.label} className="stat-card">
              <div className="flex items-center gap-2 mb-2 text-muted">
                <item.icon className="text-lg" aria-hidden />
                <h2 className="text-sm font-medium">{item.label}</h2>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Users</h2>

        <div className="space-y-3">
          {usersList?.map((user) => (
            <div
              key={user._id}
              className="card card-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <Link
                href={`/${user._id}`}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                <img
                  src={user.profileImageURL || "/default-profile.png"}
                  alt=""
                  className="avatar avatar-md shrink-0"
                />

                <div className="min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-muted truncate">
                    @{user.username}
                  </p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                  <p className="text-xs font-mono text-muted truncate mt-0.5">
                    {user._id}
                  </p>
                </div>
              </Link>

              <div
                className="flex gap-2 shrink-0"
                onClick={(e) => e.preventDefault()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    blockUser(user._id);
                  }}
                  className={`btn btn-md ${
                    user.isBanded ? "btn-accent" : "btn-secondary"
                  }`}
                >
                  {user.isBanded ? "unBand" : "Band"}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteUser(user._id);
                  }}
                  className="btn btn-destructive btn-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
