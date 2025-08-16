// pages/appointments.tsx or app/appointments/page.tsx (depending on your Next.js version)
"use client";
import React, { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  FilterIcon,
} from "lucide-react";
import { AppointmentCard } from "./ui/AppointmentCard";

interface Appointment {
  id: string;
  type: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: "upcoming" | "completed";
}

const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );

  const appointments: Appointment[] = [
    {
      id: "1",
      type: "Regular Checkup",
      doctor: "Dr. Michael Chen",
      specialty: "Cardiologist",
      date: "March 25, 2024",
      time: "10:30 AM",
      location: "Cardiology Wing, Room 302",
      notes:
        "Please bring your previous test results and current medications list.",
      status: "upcoming",
    },
    {
      id: "2",
      type: "Skin Consultation",
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      date: "March 28, 2024",
      time: "2:15 PM",
      location: "Dermatology Clinic, Room 105",
      status: "upcoming",
    },
    {
      id: "3",
      type: "Hair consultant",
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      date: "March 28, 2024",
      time: "2:15 PM",
      location: "Dermatology Clinic, Room 105",
      status: "completed",
    },
  ];

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming"
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 mb-8 w-full">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "upcoming"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming Appointments
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "history"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Appointment History
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeTab === "upcoming"
                  ? "Upcoming Appointments"
                  : "Appointment History"}
              </h1>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FilterIcon className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "upcoming" && (
              <div>
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  {completedAppointments.map((appointment) => {
                    return (
                        <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                    )
                  })}
                  {/* <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No appointment history available</p>
                  <p className="text-sm">
                    Your completed appointments will appear here
                  </p> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
