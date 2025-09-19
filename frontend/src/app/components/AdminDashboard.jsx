"use client";

import React, { useState, useEffect } from "react";
import BillingInterface from "@/app/components/Admin_dashboard/BillingInterface";
import { SideBar } from "./Admin_dashboard/SideBar";
import { CalenderSection } from "./Admin_dashboard/CalenderSection";
import { TodayAppointmentPage } from "./Admin_dashboard/TodayAppointmentPage";
import { PatientInformations } from "./Admin_dashboard/PatientInformations";
import { WhatsappMessageInbox } from "./Admin_dashboard/WhatsappMessageInbox";
import { Home } from "lucide-react";
import { IoMdHome } from "react-icons/io";
import Link from "next/link";
// Simple icon components to replace lucide-react

const MessageSquare = () => <span>💬</span>;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  const [showBilling, setShowBilling] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const [todaysAppointments, setTodaysAppointments] = useState([
    {
      id: 1,
      patientName: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.k@email.com",
      time: "10:00",
      status: "In Progress",
      type: "Follow-up Session",
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.s@email.com",
      time: "11:00",
      status: "Scheduled",
      type: "Initial Consultation",
    },
    {
      id: 3,
      patientName: "Amit Patel",
      phone: "+91 76543 21098",
      email: "amit.p@email.com",
      time: "14:00",
      status: "Completed",
      type: "Therapy Session",
    },
  ]);

  const [whatsappMessages, setWhatsappMessages] = useState([
    {
      id: 1,
      patientName: "Sunita Reddy",
      phone: "+91 95432 10987",
      message: "Can I reschedule my appointment from tomorrow to next week?",
      time: "10:30 AM",
      status: "unread",
    },
    {
      id: 2,
      patientName: "Vikram Singh",
      phone: "+91 84321 09876",
      message: "What documents should I bring for my first visit?",
      time: "09:15 AM",
      status: "unread",
    },
  ]);

  const [billingItems, setBillingItems] = useState([]);


  // Set current date on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Scheduled":
        return "text-yellow-600 bg-yellow-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      case "No-show":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setTodaysAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const openBilling = (patient) => {
    setSelectedPatient(patient);
    setShowBilling(true);
    setBillingItems([]);
  };


  const generateNextSixMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`,
      });
    }
    return months;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              PhysioClinic Admin
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MessageSquare className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {whatsappMessages.filter((m) => m.status === "unread").length}
                </span>
              </div>
              <div className="text-sm text-black">Today: {currentDate}</div> <div>
              <Link href="/" className=""><IoMdHome /></Link>
            </div>
            </div>
           
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <SideBar setActiveTab={setActiveTab} activeTab={activeTab} />
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* calender & slots */}
          <CalenderSection
            activeTab={activeTab}
            generateNextSixMonths={generateNextSixMonths}
          />
          {/* todays appointment section  */}
          <TodayAppointmentPage
            activeTab={activeTab}
            todaysAppointments={todaysAppointments}
            getStatusColor={getStatusColor}
            openBilling={openBilling}
            updateAppointmentStatus={updateAppointmentStatus}
          />
          {/* whatsapp message inbox  */}
          <WhatsappMessageInbox  activeTab={activeTab} whatsappMessages={whatsappMessages} />


          {/* complete patient information  */}
          <PatientInformations
            activeTab={activeTab}
            todaysAppointments={todaysAppointments}
          />
        </main>
      </div>

      {/* Billing Modal */}
      {showBilling && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <BillingInterface
              setShowBilling={setShowBilling}
              showBilling={showBilling}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
