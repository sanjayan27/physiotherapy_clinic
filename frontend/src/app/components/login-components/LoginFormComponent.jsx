"use client";

import Link from "next/link";
import { useContext, useState } from "react";

import { useRouter } from "next/navigation";
import { AppContext } from "@/app/context/AppContext";
export default function MobileLoginForm() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
   const {setIsLogin} = useContext(AppContext)
  const handleLogin = () => {
    if (mobileNumber.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }
    if (mobileNumber === "1234567891" && password === "admin123") {
      router.push("/admin-dashboard");
    }
    else{

        alert("login successfully");
        router.push("/");
        setIsLogin(true)
        localStorage.setItem("isLogin","true")
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

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-all transform hover:scale-[0.99] active:scale-[0.97]"
          >
            Sign In With Mobile And Password
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Forgot your password?
          </a>
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
