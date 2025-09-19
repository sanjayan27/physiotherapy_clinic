import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Sorry, you do not have the necessary permissions to view this page. Please contact an administrator if you believe this is an error.
      </p>
      <Link href="/" className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
        Go to Homepage
      </Link>
    </div>
  )}