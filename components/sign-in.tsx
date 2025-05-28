"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  return (
    <div>
      <button
        onClick={() => signIn("google")}
        type="button"
        className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
    </div>
  );
}