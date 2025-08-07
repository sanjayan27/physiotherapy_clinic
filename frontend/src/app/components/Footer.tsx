"use client"

import { Calendar, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-700 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo and Copyright */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">Physiotheraphy Clinic</span>
          </div>
          
          {/* Copyright text */}
          <div className="hidden sm:block">
            <p className="text-slate-300 text-sm">
              © 2025 Physiotheraphy Clinic. All rights reserved. Professional physiotherapy care for your wellness journey.
            </p>
          </div>
        </div>

        {/* Right side - Chat/Support button */}
        <div className="flex-shrink-0">
<button
  onClick={() =>
    window.open(
      'https://wa.me/+914426790071?text=Hi%20I%20want%20to%20book%20an%20appointment',
      '_blank'
    )
  }
  className="w-12 h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-700"
>
  <MessageCircle className="w-6 h-6 text-white" />
</button>
        </div>
      </div>

      {/* Mobile copyright text */}
      <div className="sm:hidden mt-4">
        <p className="text-slate-300 text-sm text-center">
          © 2025 Physiotheraphy Clinic. All rights reserved. Professional physiotherapy care for your wellness journey.
        </p>
      </div>
    </footer>
  );
}