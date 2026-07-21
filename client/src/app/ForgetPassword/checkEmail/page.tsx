import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="page-container-narrow flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="card w-full p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent text-2xl">
          ✉
        </div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted">
          We&apos;ve sent a password reset link to your email address. Please
          check your inbox and follow the instructions.
        </p>
        <Link href="/login" className="btn btn-secondary btn-md inline-flex">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default page;
