"use client";
import Link from "next/link";
import { useState } from "react";
import { BsCalendar4Event } from "react-icons/bs";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Links array with index values > 12
    const links = [
        { href: "/", label:"Home", index: 12},
        { href: "/book-appointment", label: "Services", index: 13 },
        { href: "/about-us", label: "About", index: 14 },
        { href: "/user-details", label: "Details", index : 16},
    ];

    return (
        <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 font-sans relative  border-b-1 border-gray-200 shadow ">
            <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <Link href="/" className="flex items-center gap-2">
                <BsCalendar4Event className="w-7 h-7 text-teal-600 font-bold drop-shadow" />
                <span className="font-extrabold text-2xl text-teal-700 tracking-wide">Clinic</span>
            </Link>
            {/* Hamburger menu button for mobile */}
            <button
                className="md:hidden flex flex-col cursor-pointer justify-center items-center w-10 h-10"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={`block h-0.5 w-6 bg-teal-700 mb-1 rounded transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`block h-0.5 w-6 bg-teal-700 mb-1 rounded transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block h-0.5 w-6 bg-teal-700 rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-8 font-semibold items-center">
            {links.map(link => (
                <Link
                key={link.index}
                href={link.href}
                className="text-gray-600 text-lg hover:text-teal-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-teal-50"
                data-index={link.index}
                >
                {link.label}
                </Link>
            ))}
            <Link
                href="admin-dashboard"
                className="ml-4 px-4 py-1 rounded-full text-white bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 shadow transition"
            >
                Admin Login
            </Link>
            </nav>
            {/* Mobile nav */}
            {menuOpen && (
            <nav className="absolute top-full left-0 w-full bg-white flex flex-col items-center md:hidden z-20 shadow-lg border-t border-teal-100 animate-fade-in">
                {links.map(link => (
                <Link
                    key={link.index}
                    href={link.href}
                    className="py-4 w-full text-center text-gray-700 hover:text-teal-700 hover:bg-teal-50 border-b transition"
                    data-index={link.index}
                    onClick={() => setMenuOpen(false)}
                >
                    {link.label}
                </Link>
                ))}
                <Link
                href="admin-dashboard"
                className="my-3 px-4 py-2 rounded-full text-white bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 shadow transition"
                onClick={() => setMenuOpen(false)}
                >
                Admin Login
                </Link>
            </nav>
            )}
        </header>
    );
}

