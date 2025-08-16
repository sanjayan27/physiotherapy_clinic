"use client";

import { Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-700 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo and Copyright */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 global-bg-color  rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">Physiotheraphy Clinic</span>
          </div>

          {/* Copyright text */}
          <div className="hidden sm:block">
            <p className="text-slate-300 text-sm">
              © 2025 Physiotheraphy Clinic. All rights reserved. Professional
              physiotherapy care for your wellness journey.
            </p>
          </div>
        </div>

        {/* Right side - Chat/Support button */}
      </div>

      {/* Mobile copyright text */}
      <div className="sm:hidden mt-4">
        <p className="text-slate-300 text-sm text-center">
          © 2025 Physiotheraphy Clinic. All rights reserved. Professional
          physiotherapy care for your wellness journey.
        </p>
      </div>
    </footer>
  );
}
