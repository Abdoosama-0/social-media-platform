"use client";

import React, { useState } from "react";

const PostImage = ({ image }: { image: string }) => {
  const [preview, setPreview] = useState(false);

  return (
    <>
      {/* image */}
      <img
        src={image}
        alt="post"
        className="rounded max-w-[500px] cursor-pointer"
          onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    setPreview(true);
  }}
   
      />

      {/* modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(false)}
        >
          <img
            src={image}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded"
          />
        </div>
      )}
    </>
  );
};

export default PostImage;