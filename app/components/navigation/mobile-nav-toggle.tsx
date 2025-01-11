"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavToggleProps {
  username: string | null | undefined;
  isLoggedIn: boolean;
  onSignOut: () => void;
  onSignIn: () => void;
}

export default function MobileNavToggle({ username, isLoggedIn, onSignOut, onSignIn }: MobileNavToggleProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Username and Hamburger Button */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <div className="text-sm text-gray-300">
            {username}
          </div>
        )}
        <button
          className="text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12" // X icon
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-0 w-full bg-gray-900 text-white shadow-md">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="/" className="hover:bg-gray-700 rounded px-3 py-2">
              Home
            </Link>
            <Link href="/report" className="hover:bg-gray-700 rounded px-3 py-2">
              Reports
            </Link>
            <button
              onClick={isLoggedIn ? onSignOut : onSignIn}
              className="bg-blue-700 hover:bg-blue-700 text-white rounded px-3 py-2"
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
