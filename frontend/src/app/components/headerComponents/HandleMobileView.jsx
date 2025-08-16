"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
const HandleMobileView = ({ isMobile = false }) => {
  return (
    <div className={`flex items-center ${isMobile ? "gap-2" : ""}`}>
      <button
        className="bg-teal-500 text-white p-2 rounded-full hover:global-bg-color  transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300"
        aria-label="User menu"
      >
        <FaUser className="w-4 h-4" />
      </button>
      {isMobile && (
        <span className="text-gray-700 font-medium">Patient Name</span>
      )}
    </div>
  );
};

export default HandleMobileView;
