"use client";
import Link from "next/link";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BsCalendar4Event } from "react-icons/bs";
import { AppContext } from "@/app/context/AppContext";

import UserDropdown from "./headerComponents/UserDropdown";

import FunctioningLinks from "./headerComponents/FunctioningLinks";

import HandleMobileView from "./headerComponents/HandleMobileView";
import { House, TicketPlus, BookUser, ListCollapse } from "lucide-react";
import summaryApi from "../common/summary.api";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { logout } from "../services/authentication.service";

// Constants moved outside component to prevent re-creation
const NAVIGATION_LINKS = [
  { href: "/", label: "Home", index: 12, icon: <House size={17} /> },
  {
    href: "/book-appointment",
    label: "Services",
    index: 13,
    icon: <TicketPlus size={17} />,
  },
  {
    href: "/about-us",
    label: "About",
    index: 14,
    icon: <BookUser size={17} />,
  },
] as const;

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const { isLogin, setIsLogin } = useContext(AppContext)!;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Memoized handlers to prevent unnecessary re-renders
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleUserAction = useCallback((action: "open" | "close") => {
    switch (action) {
      case "open":
        setUserDetails(true);
        break;
      case "close":
        setUserDetails(false);
        break;
    }
  }, []);
  const handleLogout = async () => {
    try {
      const response = await logout()
      toast.success(response.message || 'Logout successfully');
    } catch (error) {
      // Log the error, but proceed with client-side logout anyway
      toast.error(
        "Logout failed on server, but proceeding with client-side logout:",
        
      );
    } finally {
      setIsLogin(false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDetails(false);
      }
    };

    if (userDetails) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userDetails]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation links component
  const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {NAVIGATION_LINKS.map((link) => (
        <Link
          key={link.index}
          href={link.href}
          className={
            isMobile
              ? " py-4 w-full px-2 rounded text-gray-700 global-hover-text-teal global-hover-bg-mint border-b border-gray-100 transition-colors duration-150 flex flex-row items-center gap-1 "
              : "text-gray-600 text-lg global-hover-text-teal transition-colors duration-200 px-3 py-2 rounded-md global-hover-bg-mint flex items-center gap-1"
          }
          onClick={isMobile ? closeMenu : undefined}
        >
          <span className="">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
<BsCalendar4Event className="w-7 h-7 global-text-color-navy transition-transform duration-200 group-hover:scale-110" />
            <span className="font-extrabold text-2xl global-text-color-navy tracking-wide">
              Clinic Name
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavigationLinks />

            {isLogin ? (
              <div className="ml-4 ">
                <UserDropdown
                  handleLogout={handleLogout}
                  handleUserAction={handleUserAction}
                  dropdownRef={dropdownRef}
                  userDetails={userDetails}
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-6 py-2 rounded-full text-white btn-brand-gradient shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-brand-bar rounded transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-0.5" : "mb-1"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-brand-bar rounded transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "mb-1"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-brand-bar rounded transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg h-screen">
          {/* User Section for Mobile */}
          {isLogin && (
            <div className="px-4 py-3 border-b border-gray-100 relative">
              <HandleMobileView isMobile />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col  px-5 ">
            <div className="flex flex-col justify-between h-full ">
              <div className="">
                <NavigationLinks isMobile />
              </div>
              <FunctioningLinks
                handleLogout={handleLogout}
                handleUserAction={handleUserAction}
                closeMenu={closeMenu}
                isMobile
              />
            </div>
            {!isLogin && (
              <div className="p-4 border-t border-gray-100 ">
                <Link
                  href="/login"
                  className="block w-full text-center px-6 py-3 rounded-full text-white btn-brand-gradient shadow-md transition-all duration-200"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
