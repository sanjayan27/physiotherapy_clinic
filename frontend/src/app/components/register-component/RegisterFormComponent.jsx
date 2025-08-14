"use client"

import Link from "next/link";
import { useState } from "react";

export default function MobileRegisterForm() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobileNumber.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      alert("OTP sent successfully!");
    }, 1500);
  };

  const handleRegister = () => {
    if (!isOtpSent) {
      alert("Please verify your mobile number first");
      return;
    }
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }
    if (!confirmPassword) {
      alert("Please confirm your password");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    
    alert("Registration successful!");
  };

  return (
    <div className="min-h-[80vh]   bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
          <p className="text-gray-600">Welcome user, please register to continue</p>
        </div>

        <div className="space-y-6">
          {/* Mobile Number Input with Verify Button */}
          <div>
            <div className="relative">
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                maxLength="10"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || mobileNumber.length < 10 || isOtpSent}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium rounded transition-all
                  ${isOtpSent 
                    ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                    : isLoading || mobileNumber.length < 10
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                  }`}
              >
                {isLoading ? 'Sending...' : isOtpSent ? 'Sent ✓' : 'Verify'}
              </button>
            </div>
          </div>

          {/* OTP Input - Shows only after verification is sent */}
          {isOtpSent && (
            <div className="animate-fadeIn">
              <input
                type="text"
                placeholder="Enter OTP *"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                maxLength="6"
                required
              />
            </div>
          )}

          {/* New Password Input */}
          <div>
            <input
              type="password"
              placeholder="Enter New Password *"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                confirmPassword && newPassword !== confirmPassword 
                  ? 'border-red-300 focus:ring-red-500' 
                  : confirmPassword && newPassword === confirmPassword
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
              <p className="text-green-500 text-sm mt-1">Passwords match ✓</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-all transform hover:scale-[0.99] active:scale-[0.97]"
          >
            Register With Mobile And Password
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">Already have an account? </span>
          <Link href="/login" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Sign in here
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}