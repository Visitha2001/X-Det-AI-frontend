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
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { username, logout } = useAuth();
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false); // State to track if the profile image failed to load

  const navItems = [
    { name: "Home", path: "/home", icon: <FaHome /> },
    { name: "Support", path: "/chatbot", icon: <FaRobot /> },
    { name: "Diseases", path: "/diseases", icon: <FaMedkit /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "History", path: "/history", icon: <FaGlobe /> },
  ];

  // History item is only shown if a user is logged in (via NextAuth or custom auth)
  const filteredNavItems = navItems.filter((item) =>
    item.name === "History" ? session?.user || username : true
  );

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsClicked(false), 300);
  };

  const handleSignOut = async () => { // Made async to handle signOut from next-auth
    setDropdownOpen(false);
    if (session) {
      await signOut({ callbackUrl: "/signin" }); // Redirect to signin after NextAuth signOut
    } else {
      logout(); // Custom logout
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("username");
      router.push("/signin");
    }
  };

  // Reset imageError state when the session user image URL changes
  // This is crucial: if a user logs out and logs back in, or switches accounts,
  // we want to re-attempt loading the image.
  useEffect(() => {
    setImageError(false);
  }, [session?.user?.image]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-gray-900/80 backdrop-blur-[6px] backdrop-saturate-150">
        <div className="sm:px-50 mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="flex items-center">
            <Image src={Logo} alt="Logo" width={100} height={40} className="object-cover" unoptimized />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {/* Display first 4 items for desktop navigation */}
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

          <div className="relative flex items-center space-x-4">
            {session?.user || username ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 focus:outline-none sm:mr-5 mr-0 cursor-pointer"
                  >
                    {/* Conditional rendering for profile image or fallback icon */}
                    {session?.user?.image && !imageError ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
                        unoptimized
                        onError={() => setImageError(true)} // Set error state if image fails to load
                      />
                    ) : (
                      // Fallback icon if no image, or if image failed to load
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                    <span className="text-gray-300 hidden sm:inline">
                      {session?.user?.name || session?.user?.email?.split("@")[0] || username}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-5 mt-2 w-40 bg-gray-800/60 backdrop-blur-md border border-gray-600 rounded-2xl shadow-xl z-50">
                      <Link
                        href="/history"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 rounded-t-2xl"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaGlobe className="inline-block mr-2" />
                        History
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 flex items-center rounded-b-2xl"
                      >
                        <FiLogOut className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Sign In/Sign Up buttons if no user is logged in
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
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-gray-950 backdrop-blur-[2px] py-4 px-2 flex justify-around fixed bottom-0 left-0 right-0 z-50">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center min-w-[60px] text-gray-400 hover:text-blue-300 transition-colors"
            >
              <div
                className={`py-1 px-4 rounded-xl ripple-container ${
                  isActive ? "bg-blue-900/80 text-blue-300" : "hover:bg-gray-700 text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-blue-300" : "text-white"}`}>
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
        className={`fixed z-50 bottom-26 sm:bottom-6 right-6 bg-gray-800/50 backdrop-blur-[2px] text-white w-12 h-12 border-2 cursor-pointer border-gray-200/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isHovered ? "bg-gray-700 scale-120" : "scale-100"
        } ${isClicked ? "transform scale-90" : ""}`}
        aria-label="Back to Top"
      >
        <motion.div
          animate={{ y: isHovered ? [-2, 2, -2] : 0 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-colors duration-300 ${
              isHovered ? "text-white" : "text-gray-300"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.div>
      </button>
    </>
  );
}