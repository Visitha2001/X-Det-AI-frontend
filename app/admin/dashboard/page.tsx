'use client'
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function page() {
  const { isAdmin, username } = useAuth();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mb-10">
            You don't have administrator privileges to view this page.
          </p>
          <Link href="/home" className="text-white px-5 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600">
                Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="justify-between items-center px-50 py-10">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-lg text-gray-500">
          Welcome back, <span className="font-medium text-blue-400">{username}</span>
        </div>
      </div>
    </div>
  );
}