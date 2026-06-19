import Link from "next/link";
import React from "react";

const Followers = ({ id }: any) => {
  const [clicked, setClicked] = React.useState(false);
  const [followers, setFollowers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchFollowers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/followers`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setFollowers(data.followers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setClicked(true);

    if (followers.length === 0) {
      await fetchFollowers();
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="text-sm text-gray-500"
      >
        Show Followers
      </button>

      {clicked && (
        <div
          onClick={() => setClicked(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded-lg min-w-[300px]"
          >
            <h2 className="text-lg font-bold mb-4">
              Followers
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : followers.length === 0 ? (
              <p>No followers found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {followers.map((user: any) => (
                   <Link
                    href={`/${user._id}`}
                    key={user._id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={user.profileImageURL}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />

                    <span>{user.username}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Followers;