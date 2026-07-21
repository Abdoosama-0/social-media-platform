import React from "react";
import Posts from "./Posts";
import Search from "./Search";
import CreatePost from "./CreatePost";

const Main = () => {
  return (
    <div className="page-container">
          
      
      {/* <div className="mb-8 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">
          Feed
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Discover posts from people you follow
        </p>
      </div>
      <p>dsddsd</p> */}
      <Posts />
    </div>
  );
};

export default Main;
