import Link from "next/link";
import React from "react";

const NotUser = () => {
  return (
    <div className="page-container-narrow">
      <div className="card p-8 text-center space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to SocialNet</h1>
          <p className="text-muted text-sm">
            Sign in to connect with friends and share your moments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn btn-primary btn-md">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary btn-md">
            Register
          </Link>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="btn btn-secondary btn-md w-full sm:w-auto inline-flex"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
};

export default NotUser;
