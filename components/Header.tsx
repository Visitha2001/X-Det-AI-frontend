"use client";

import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaUser, FaRobot, FaClinicMedical, FaHome, FaSignOutAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Logo from "../public/assets/Dark_Logo.png";
import { FaKitMedical } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome className="mr-1" />,
    },
    {
      name: "Support",
      path: "/chatbot",
      icon: <FaRobot className="mr-1" />,
    },
    {
      name: "Diseases",
      path: "/diseases",
      icon: <FaKitMedical className="mr-1" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={40}
            className="object-cover"
            unoptimized={true}
          />
        </Link>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative group text-gray-300 hover:text-white transition-colors"
            >
              <div className="flex items-center">
                {item.name}
              </div>
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${
                  pathname === item.path ? "w-full" : ""
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Auth Section - Right */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {session.user.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <FaUser className="text-gray-400" />
                </div>
              )}
              <span className="text-gray-300 hidden sm:inline">
                {session.user?.name || "User"}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 text-sm py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors flex items-center justify-center" // Added flex classes for centering icon/text
              >
                {/* Logout icon for mobile screens (md:hidden) */}
                <span className="">
                  <FiLogOut className="w-5 h-5" />
                </span>
                <span className="hidden md:inline ml-1">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-3 py-2 text-sm rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors flex items-center"
              >
                <FcGoogle className="mr-2" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Compact */}
      <nav className="md:hidden bg-gray-800 py-1 px-2 flex justify-around fixed bottom-0 left-0 right-0 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center p-1 rounded-lg min-w-[60px] ${
              pathname === item.path
                ? "text-blue-400 bg-gray-700"
                : "text-gray-400 hover:bg-gray-700"
            } transition-colors`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}