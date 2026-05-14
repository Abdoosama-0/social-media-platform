"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/users/me",
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const result = await res.json();

        setData(result);

      } catch (err) {
        console.log(err);
      }
    };

    getMe();
  }, []);

  return (
    <div className="p-5">
      {data ? (
        <div className="flex flex-col gap-3">

          <img
            src={data.user.profileImageURL}
            alt="profile"
            className="w-24 h-24 rounded-full"
          />

          <h1>Name: {data.user.name}</h1>

          <p>Username: {data.user.username}</p>

          <p>Email: {data.user.email}</p>

          <p>Role: {data.user.role}</p>

          <hr />

          <p>Posts Count: {data.postsCount}</p>

          <p>Followers Count: {data.followersCount}</p>

          <p>Following Count: {data.followingCount}</p>

          <p>Posts Array Length: {data.posts.length}</p>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;