"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const { username, adminLogout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/disease', label: 'Diseases' },
    { href: '/admin/users', label: 'Users' }
  ];

  return (
    <header className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-400">Admin Panel</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.href
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="hidden md:flex md:items-center">
            {username ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, <span className="text-blue-400">{username}</span></span>
                <button
                  onClick={adminLogout}
                  className="text-white px-5 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/admin/login" className="text-white px-5 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600">
                  Login
                </Link>
                <Link href="/home" className="text-white px-5 py-2 rounded-2xl bg-red-500 hover:bg-red-600 ml-2">
                  Home
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button (not fully implemented) */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
