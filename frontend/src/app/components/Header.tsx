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
        <header className="flex flex-col md:flex-row justify-between items-center px-4 py-4 bg-gray-100 relative font-sans">
            <div className="flex items-center gap-2 w-full md:w-auto justify-between">
                <Link href="/" className="flex items-center gap-1">
                    <BsCalendar4Event className="w-5 h-5 text-teal-600 font-bold" />
                    <span className="font-bold text-2xl text-teal-600">Clinic</span>
                </Link>
                {/* Hamburger menu button for mobile */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
                    <span className={`block h-0.5 w-6 bg-gray-800 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-6 font-semibold ">
                {links.map(link => (
                    <Link
                        key={link.index}
                        href={link.href}
                        className="text-gray-500 text-md hover:text-blue-600 transition"
                        data-index={link.index}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link href="admin-dashboard" className="border px-2 rounded  text-white hover:bg-teal-700 bg-teal-600">
                    Admin Login
                </Link>
            </nav>
            {/* Mobile nav */}
            {menuOpen && (
                <nav className="absolute top-full left-0 w-full bg-gray-100 flex flex-col items-center md:hidden z-15 shadow-lg">
                    {links.map(link => (
                        <Link
                            key={link.index}
                            href={link.href}
                            className="py-3 w-full text-center text-gray-800 hover:text-blue-600 border-b"
                            data-index={link.index}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="admin-dashboard" className="border px-2 rounded text-white hover:bg-teal-700 bg-teal-600">
                    Admin Login
                </Link>
                </nav>
            )}
        </header>
    );
}

