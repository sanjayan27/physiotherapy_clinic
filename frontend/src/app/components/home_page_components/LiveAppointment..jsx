import React from 'react';

const DelayNotification = () => {
  return (
    <div className="flex justify-center items-center h-fit  my-10 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        
        {/* Decorative background circle */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-teal-500 rounded-full opacity-10"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500 animate-pulse"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 10-2 0v2H6a1 1 0 100 2h1v2a1 1 0 102 0v-2h1a1 1 0 100-2h-1V7z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Delayed Slot</h2>
          </div>
          <span className="text-sm text-gray-500 font-medium">120 mins</span>
        </div>

        <p className="text-2xl font-light text-gray-900 leading-snug mb-4">
          The slot at <strong className="font-semibold text-red-500">11:20 AM</strong> is delayed.
        </p>
        
        <div className="border-t-2 border-gray-100 pt-4 mt-4">
          <p className="text-sm text-gray-500 mb-2">New Scheduled Time:</p>
          <div className="flex items-center space-x-4">
            <div className="bg-teal-500 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-4xl font-extrabold text-teal-600">01:20 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelayNotification;