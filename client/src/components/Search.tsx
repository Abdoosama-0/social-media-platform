"use client";

import Link from "next/link";
import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import type { SearchUser } from "@/types";

const Search = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchUser[]>([]);
  const [focused, setFocused] = React.useState(false);

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
          credentials: "include",
        }
      );

      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const showResults = focused && query.trim() && results.length > 0;

  return (
    <div className="relative max-w-xl">
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>
      <div className="relative">
        <HiOutlineSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          aria-hidden
        />
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search users..."
          className="input pl-10"
          autoComplete="off"
        />
      </div>

      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-2 card overflow-hidden z-20"
          role="listbox"
          aria-label="Search results"
        >
          {results.map((user) => (
            <Link
              href={`/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover border-b border-border last:border-b-0"
              role="option"
            >
              <img
                src={user.profileImageURL || "/default-profile.png"}
                alt=""
                className="avatar avatar-md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-muted truncate">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {focused && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 card px-4 py-6 empty-state z-20">
          <p className="text-sm">No users found</p>
        </div>
      )}
    </div>
  );
};

export default Search;
