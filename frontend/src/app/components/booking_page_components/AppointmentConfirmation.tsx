"use client";

import React from "react";
import { CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppointmentConfirmationProps {
  onClose: () => void;
}

export const AppointmentConfirmation: React.FC<
  AppointmentConfirmationProps
> = ({ onClose }) => {
  const router = useRouter();
  return (
    <div className="w-full flex items-center justify-center p-4 min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          Appointment Booked!
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Your appointment has been successfully scheduled. You will receive a
          confirmation email shortly with the details.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 bg-teal-600 hover:bg-teal-700"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
};
