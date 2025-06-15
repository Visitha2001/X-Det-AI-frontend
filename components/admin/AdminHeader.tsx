// components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaViruses, 
  FaUsers, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaHome, 
  FaStar,
  FaPage4,
  FaNewspaper
} from 'react-icons/fa';
import Image from 'next/image';
import Logo from "../../public/assets/T_logo.png";

export default function AdminSidebar() {
  const { username, adminLogout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="mr-3" /> },
    { href: '/admin/disease', label: 'Diseases', icon: <FaViruses className="mr-3" /> },
    { href: '/admin/users', label: 'Users', icon: <FaUsers className="mr-3" /> },
    { href: '/admin/review', label: 'Manage Reviews', icon: <FaStar className="mr-3" />},
    { href: '/admin/newsletter', label: 'Newsletter', icon: <FaNewspaper className="mr-3" />}
  ];

  return (
    <div className="md:flex md:flex-shrink-0">
      <div className="flex flex-col w-80 bg-gray-900 border-r border-gray-800">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800 bg-blue-950 py-15">
          <Link href="/admin/dashboard" className="text-xl text-blue-400 hover:text-blue-300">
            <Image src={Logo} alt="Logo" width={100} height={40} className="object-cover ml-2 mb-[-20px]" unoptimized />
            Admin Panel
          </Link>
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  pathname === link.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* User section at bottom */}
          <div className="mt-auto mb-4 pt-4 border-t border-gray-800">
            {username ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  {/* User icon */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span className="text-md text-gray-200 font-medium">
                   Welcome Back, <strong className='text-blue-500'>{username}</strong>
                  </span>
                </div>
                <button
                  onClick={adminLogout}
                  className="w-full flex items-center justify-center space-x-2 text-xs text-white px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors"
                >
                  <FaSignOutAlt className="h-3 w-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/admin/login"
                  className="w-full flex items-center justify-center space-x-2 text-white px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-sm"
                >
                  <FaSignInAlt className="h-3 w-3" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/home"
                  className="w-full flex items-center justify-center space-x-2 text-white px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  <FaHome className="h-3 w-3" />
                  <span>Back to Home</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}