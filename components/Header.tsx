"use client";

import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaUser, FaRobot, FaHome, FaInfoCircle, FaGlobe, FaMedkit } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Logo from "../public/assets/T_logo.png";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const { username, logout } = useAuth();
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/home", icon: <FaHome /> },
    { name: "Support", path: "/chatbot", icon: <FaRobot /> },
    { name: "Diseases", path: "/diseases", icon: <FaMedkit /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "History", path: "/history", icon: <FaGlobe /> },
  ];

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsClicked(false), 300);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    if (session) {
      signOut();
    } else {
      logout();
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("username");
      router.push("/signin");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <Image src={Logo} alt="Logo" width={100} height={40} className="object-cover" unoptimized />
        </Link>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative group text-gray-300 hover:text-white transition-colors"
              >
                <div className={`flex items-center mb-1 ${isActive ? "text-blue-300" : ""}`}>
                  {item.name}
                </div>
                <span
                  className={`absolute bottom-0 left-1/2 h-[3px] bg-blue-400 transition-all duration-300 ${
                    isActive ? "w-3 left-[calc(50%-6px)]" : "w-0 group-hover:w-full group-hover:left-0"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Auth Section - Right */}
        <div className="relative flex items-center space-x-4">
          {session?.user || username ? (
            <>
              {/* Avatar + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none sm:mr-5 mr-0"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                      <FaUser className="text-gray-400" />
                    </div>
                  )}
                  <span className="text-gray-300 hidden sm:inline">
                    {session?.user?.name || session?.user?.email?.split("@")[0] || username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-5 mt-2 w-40 bg-gray-800/60 backdrop-blur-md border border-gray-600 rounded-2xl shadow-xl z-50"
                  >
                    <Link
                      href="/history"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-t-2xl"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaGlobe className="inline-block mr-2" />
                      History
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center rounded-b-2xl"
                    >
                      <FiLogOut className="mr-2" />
                      Sign Out
                    </button>
                  </div>                
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-3 py-2 text-sm rounded-2xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors flex items-center"
              >
                <FcGoogle className="mr-2" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 text-sm rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-gray-900 py-2 px-2 flex justify-around fixed bottom-0 left-0 right-0 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center min-w-[60px] text-gray-400 hover:text-blue-300 transition-colors"
            >
              <div
                className={`py-1 px-3 rounded-xl ripple-container ${
                  isActive ? "bg-blue-900 text-blue-400" : "hover:bg-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-blue-400" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-20 sm:bottom-6 right-6 bg-gray-800 text-white w-12 h-12 border-2 border-gray-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isHovered ? "bg-gray-700 scale-110" : "scale-100"
        } ${isClicked ? "transform scale-90" : ""}`}
        style={{ zIndex: 1000 }}
        aria-label="Back to Top"
      >
        <motion.div
          animate={{ y: isHovered ? [-2, 2, -2] : 0 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-colors duration-300 ${
              isHovered ? "text-white" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.div>
      </button>
    </header>
  );
}