'use client'
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
  const { isAdmin, username } = useAuth();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, <span className="font-medium text-primary">{username}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium">Total Diseases</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium">Registered Users</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium">Active Sessions</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium">System Health</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}