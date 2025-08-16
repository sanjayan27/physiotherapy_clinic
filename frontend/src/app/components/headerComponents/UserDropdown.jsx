// User dropdown component
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
const UserDropdown = ({
  isMobile = false,
  handleUserAction,
  dropdownRef,
  userDetails,
}) => (
  <div
    className={`${isMobile ? "" : "relative"}`}
    ref={!isMobile ? dropdownRef : undefined}
  >
    <div className={`flex items-center ${isMobile ? "gap-2" : ""}`}>
      <button
        className="bg-teal-500 text-white p-2 rounded-full hover:global-bg-color  transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer"
        onClick={() => handleUserAction("open")}
        aria-label="User menu"
      >
        <FaUser className="w-4 h-4" />
      </button>
      {isMobile && (
        <span className="text-gray-700 font-medium">Patient Name</span>
      )}
    </div>

    <div
      className={`absolute ${
        isMobile ? "top-full right-0" : "top-full right-0"
      } mt-2 z-50 bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-200 ${
        userDetails
          ? "opacity-100 visible transform scale-100"
          : "opacity-0 invisible transform scale-95"
      }`}
    >
      <div className="w-48">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <p className="font-medium text-gray-700 capitalize">Your Account</p>
          <button
            className="text-2xl text-gray-400 hover:global-text-color-teal transition-colors duration-150 focus:outline-none"
            onClick={() => handleUserAction("close")}
            aria-label="Close menu"
          >
            <RiArrowDropDownLine className="rotate-180 cursor-pointer" />
          </button>
        </div>
        <div className="py-1">
          <Link
            href="/user-details"
            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
            onClick={() => handleUserAction("close")}
          >
            Your Details
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-teal-50 hover:text-red-600 transition-colors duration-150 cursor-pointer"
            onClick={() => handleUserAction("logout")}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default UserDropdown;
