"use client";
import React, { useState, useEffect, useCallback } from "react";

interface SideBarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

export const SideBar: React.FC<SideBarProps> = ({ setActiveTab, activeTab }) => {
  const [expanded, setExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0); // ✅ track screen width

  // Navigation items
  const navItems = [
    { id: "calendar", icon: "📅", label: "Calendar & Slots" },
    { id: "appointments", icon: "⏰", label: "Today's Appointments" },
    { id: "patients", icon: "👥", label: "Patient Records" },
    { id: "requested", icon: "📅", label: "Requested Appointments" },
    { id: "messages", icon: "💬", label: "WhatsApp Messages" },
  ];

  // Handle responsive behavior
  useEffect(() => {
    // ✅ Only runs client-side
    const updateWidth = () => setWindowWidth(window.innerWidth);

    updateWidth(); // set initial width
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Toggle sidebar
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      // Auto-collapse on mobile after selection
      if (windowWidth < 768) {
        setExpanded(false);
      }
    },
    [setActiveTab, windowWidth]
  );

  return (
    <>
      {/* Mobile backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      <nav
        className={`
          bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0 
          transition-all duration-300 z-50
          ${expanded ? "w-64" : "w-16"} md:w-64
        `}
      >
        <div className="p-2 flex flex-col h-full">
          {/* Toggle button for mobile */}
          <div className="md:hidden flex justify-end mb-2">
            <button
              onClick={toggleExpanded}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Toggle sidebar"
            >
              <span className="text-lg">{expanded ? "⬅️" : "➡️"}</span>
            </button>
          </div>

          {/* Header */}
          {(expanded || windowWidth >= 768) && (
            <div className="hidden md:block p-2 mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">Admin Panel</h2>
            </div>
          )}

          {/* Navigation Items */}
          <ul className="space-y-2 flex-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    w-full flex items-center px-3 py-3 rounded-lg text-left 
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    ${!expanded && windowWidth < 768 ? "justify-center" : ""}
                  `}
                  title={!expanded && windowWidth < 768 ? item.label : undefined}
                >
                  {/* Icon */}
                  <span className="text-xl flex-shrink-0">{item.icon}</span>

                  {/* Label - show on desktop or when expanded on mobile */}
                  {(expanded || windowWidth >= 768) && (
                    <span className="ml-3 font-medium hidden md:inline">
                      {item.label}
                    </span>
                  )}

                  {/* Mobile expanded label */}
                  {expanded && windowWidth < 768 && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          {(expanded || windowWidth >= 768) && (
            <div className="hidden md:block p-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Dashboard v1.0
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
