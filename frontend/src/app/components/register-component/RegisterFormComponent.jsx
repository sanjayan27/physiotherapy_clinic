"use client";

import Link from "next/link";
import { useState } from "react";
import Axios from "../../utils/Axios";
import summaryApi from "../../common/summary.api";

export default function MobileRegisterForm() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bdDate, setBdDate] = useState("");
  const [location, setLocation] = useState("");

  // Send OTP to email
  // const handleSendOtp = async () => {
  //   if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  //     alert("Please enter a valid email address");
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     const response = await Axios({
  //       url: summaryApi.register.endpoint,
  //       method: summaryApi.request_otp.method,
  //       data : {email: email}
  //     });
  //     console.log('response',response)
  //     setIsOtpSent(true);
  //     setIsLoading(false);
  //     alert("OTP sent to your email!");
  //   } catch (error) {
  //      console.log(error)
  //   }
   
  // };

  const handleRegister = async () => {
    // Validate all fields
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    // if (!isOtpSent) {
    //   alert("Please verify your email first");
    //   return;
    // }
    // if (!otp) {
    //   alert("Please enter the OTP");
    //   return;
    // }
    try {
      const response = await Axios({
        url: summaryApi.register.endpoint,
        method: summaryApi.register.method,
        data: {
          name,
          email,
          phoneNumber: mobileNumber,
          bdDate,
          location
          // code: otp,
        },
      });
      if (response.data && response.data.success) {
        alert("Registration successful!");
      } else {
        alert(response.data?.message || "Registration failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh]   bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
          <p className="text-gray-600">
            Welcome user, please register to continue
          </p>
        </div>

        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          {/* Email Input with OTP Button */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              {/* <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || !email.trim() || isOtpSent}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium rounded transition-all
                  ${
                    isOtpSent
                      ? "bg-green-100 text-green-600 cursor-not-allowed"
                      : isLoading || !email.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                  }`}
              >
                {isLoading ? "Sending..." : isOtpSent ? "Sent ✓" : "Send OTP"}
              </button> */}
            </div>
          </div>
          {/* Mobile Number Input */}
          <div>
            <input
              type="tel"
              placeholder="Mobile Number *"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              maxLength="10"
              required
            />
          </div>
          <div>
            <input
              type="string"
              placeholder="Birth date (YYYY-MM-DD) *"
              value={bdDate}
              onChange={(e) => setBdDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              maxLength="10"
              required
            />
          </div>
          <div>
            <input
              type="string"
              placeholder="Location (eg:Chennai,Trichy) *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              maxLength="10"
              required
            />
          </div>

          {/* OTP Input - Shows only after verification is sent */}
          {/* {isOtpSent && (
            <div className="animate-fadeIn">
              <input
                type="text"
                placeholder="Enter OTP *"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                maxLength="6"
                required
              />
            </div>
          )} */}

          {/* Password fields removed */}

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-all transform hover:scale-[0.99] active:scale-[0.97]"
          >
            Register
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
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
