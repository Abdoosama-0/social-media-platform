import Link from "next/link";
import React from "react";
type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImageURL?: string;
};
const Search = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<User[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/users/search/?q=${value}`,
        {
          credentials: "include", // 👈 include cookies / auth
        }
      );

      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
      />

   <div>
  {(results || []).map((user: User) => (
    <div className="flex border items-center gap-3 p-2" key={user._id}>
      <Link href={`/${user._id}`} className="flex items-center gap-3 w-full">
        
        <img
          src={user.profileImageURL || "/default-profile.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>

      </Link>
    </div>
  ))}
</div>



    </div>
  );
};

export default Search;