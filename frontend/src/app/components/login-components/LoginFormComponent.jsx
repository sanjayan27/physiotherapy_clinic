"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/context/AppContext";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import { AxiosToastSuccess } from "@/app/utils/AxiosToastSended";
import toast from "react-hot-toast";
export default function MobileLoginForm() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' or 'email'
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setIsLogin } = useContext(AppContext);
console.log("setIsLogin",setIsLogin)
  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === "phone" ? "email" : "phone"));
    // Reset states on method switch
    setIsOtpSent(false);
    setOtp("");
    setEmail("");
    setPhoneNumber("");
    setIsLoading(false);
  };

  // Helper function to validate the current identifier (email or phone)
  const validateIdentifier = () => {
    if (loginMethod === "email") {
      if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }
    } else {
      // phone
      if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) {
        alert("Please enter a valid 10-digit mobile number");
        return false;
      }
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateIdentifier()) return;

    setIsLoading(true);
    try {
      const payload =
        loginMethod === "email" ? { email : email } : { phoneNumber: `${phoneNumber}` };
        console.log(payload)
      const response = await Axios({
        url: summaryApi.request_otp.endpoint,
        method: summaryApi.request_otp.method,
        data: payload,
      });
      console.log('response',response)
      if(response?.data){
        setIsOtpSent(true);
        toast.success(`OTP sent to your ${loginMethod}!`);  
      }
        
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateIdentifier()) return;

    if (!otp) {
      toast.error("Please enter your OTP");
      return;
    }

    const payload =
      loginMethod === "email"
        ? { email, code: otp }
        : { phoneNumber: `+91${phoneNumber}`, code: otp };
    try {
      const response = await Axios({
        url: summaryApi.login.endpoint,
        method: summaryApi.login.method,
        data: payload,
        withCredentials: true,
      });
      if (response.data && response.data.success) {
        // AxiosToastSuccess(response.data.message)
        setIsLogin(true);
        localStorage.setItem("isLogin", "true");
        // Store user info from the response payload, not the cookie
        if (response.data.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          toast.success("Login Successful")
        }
        if (response.data.data.user.role === "superadmin") {
          router.push("/admin-dashboard");
        } else if (response.data.data.user.role === "user") {
          router.push("/user-details");
        }
      } else {
        toast.error(response.data?.message || "Login failed. Please check your OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  
  return (
    <div className="min-h-[80vh]   bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600">
            Welcome user, please sign in to continue
          </p>
        </div>

        <div className="space-y-6">
          {loginMethod === "phone" ? (
            <div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 pr-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  maxLength="13"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !phoneNumber.trim() || isOtpSent}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium rounded transition-all
                    ${
                      isOtpSent
                        ? "bg-green-100 text-green-600 cursor-not-allowed"
                        : isLoading || !phoneNumber.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                    }`}
                >
                  {isLoading ? "Sending..." : isOtpSent ? "Sent ✓" : "Send OTP"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pr-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
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
                </button>
              </div>
            </div>
          )}

          {/* OTP Input */}
          {isOtpSent && (
            <div>
              <input
                type="text"
                placeholder="Enter your OTP here"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                maxLength="6"
                required
                inputMode="numeric"
              />
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-all transform hover:scale-[0.99] active:scale-[0.97]"
          >
            Sign In With {loginMethod === "phone" ? "Phone" : "Email"} and OTP
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleLoginMethod}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Sign in with {loginMethod === "phone" ? "Email" : "Phone Number"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
