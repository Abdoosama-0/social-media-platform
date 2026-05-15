"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        alert(`fetch  ${process.env.NEXT_PUBLIC_API_URL}`)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
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
          <p>posts:</p>

          {data.posts.map((post: any) => (
  <div
    key={post._id}
    className="border p-4 rounded mb-4"
  >


    {/* أول صورة فقط */}
    <img
      src={post.images[0]}
      alt="post"
      className="w-[300px] h-[300px] object-cover rounded mt-2"
    />

  </div>
))}




        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;