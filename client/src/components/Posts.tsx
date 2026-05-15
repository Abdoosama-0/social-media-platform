"use client";

import React, {
  useEffect,
  useState,
} from "react";

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // fetch posts
  const fetchPosts = async (
    pageNumber: number
  ) => {
    try {
      setLoading(true);
  alert(`fetch  ${process.env.NEXT_PUBLIC_API_URL}`)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${pageNumber}`,
    {
        credentials: 'include'
    }
      );

      if (!res.ok) return;

      const data = await res.json();

      setHasMore(data.hasMore);

      setPosts((prev) => {
        let updatedPosts = [];

        // لو page 1 → الجديد فوق القديم
        if (pageNumber === 1) {
          updatedPosts = [
            ...data.posts,
            ...prev,
          ];
        } else {
          // pagination عادي
          updatedPosts = [
            ...prev,
            ...data.posts,
          ];
        }

        // منع التكرار
        const uniquePosts =
          updatedPosts.filter(
            (post, index, self) =>
              index ===
              self.findIndex(
                (p) => p._id === post._id
              )
          );

        // خزّن
        localStorage.setItem(
          "posts",
          JSON.stringify(uniquePosts)
        );

        return uniquePosts;
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // أول تحميل
  useEffect(() => {

    // اعرض القديم فورًا
    const savedPosts =
      localStorage.getItem("posts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // هات الجديد
    fetchPosts(1);

  }, []);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {

      if (
        window.innerHeight +
          window.scrollY >=
          document.body.offsetHeight -
            200 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, [hasMore, loading]);

  // لما page يزيد
  useEffect(() => {
    if (page === 1) return;

    fetchPosts(page);

  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">

      {posts.map((post) => (
        <div
          key={post._id}
          className="border p-4 rounded"
        >

          {/* user */}
          <div className="flex items-center gap-2 mb-3">

            <img
              src={
                post.author
                  .profileImageURL
              }
              alt="profile"
              className="w-10 h-10 rounded-full"
            />

            <p className="font-bold">
              {post.author.name}
            </p>

          </div>

          {/* title */}
          <h2 className="mb-3">
            {post.title}
          </h2>

          {/* first image */}
          {post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="post"
              className="rounded max-w-[500px]"
            />
          )}

        </div>
      ))}

      {loading && (
        <p className="text-center">
          Loading...
        </p>
      )}
<button onClick={()=> window.location.reload()}>load more</button>
    </div>
  );
};

export default Posts;